(function () {
    "use strict";

    function getContainerElements() {
        return Array.prototype.concat.apply([], document.getElementsByClassName('component-selector'));
    }

    function getSelectElements() {
        return Array.prototype.concat.apply([], document.getElementsByClassName('component-selector__control'));
    }

    function prepareComponentList(components) {
        var componentList = {
            learn: {
                label: "Learn ZF",
                choices: []
            },
            middleware: {
                label: "Expressive and PSR-15 Middleware",
                choices: []
            },
            mvc: {
                label: "MVC Framework",
                choices: []
            },
            components: {
                label: "Components",
                choices: []
            },
            projects: {
                label: "Tooling and Composer Plugins",
                choices: []
            },
        };
        var uncategorized = [];

        // eslint-disable-next-line no-use-before-define
        const matchActive = new RegExp('\/' + siteName + '(\/|$)');

        components.forEach(function (component) {
            const selected = matchActive.test(component.url);
            const packageName = component.package.split('/');
            const label = component.name + '<br/><span class="choices__packagename">' + packageName[1] + '</span>';
            const choice = {
                value: component.url,
                label: label,
                selected: selected,
                customProperties: {
                    description: component.description
                }
            };

            componentList.hasOwnProperty(component.group)
                ? componentList[component.group].choices.push(choice)
                : uncategorized.push(choice);
        });

        // Initialize the Choices selector using the component selector as its element
        getSelectElements().forEach(function(element) {
            const choices = new Choices(element, {
                itemSelectText: '',
                renderChoiceLimit: -1,
                searchChoices: true,
                searchEnabled: true,
                searchFields: ['label', 'customProperties.description'],
                searchPlaceholderValue: 'Jump to package documentation...',
                searchResultLimit: 10,
                shouldSort: false
            });

            choices.setChoices(
                Array.prototype.concat.apply(Object.values(componentList), uncategorized),
                'value',
                'label',
                true
            );

            // On selection of a choice, redirect to its URL
            element.addEventListener('choice', function (event) {
                window.location.href = event.detail.choice.value;
            }, false);

            // Ensure the parent container expands to fit the list...
            element.addEventListener('showDropdown', function (event) {
                getContainerElements().forEach(function (container) {
                    const choicesList = container.querySelector('.choices__list--dropdown');
                    container.parentElement.style.minHeight = container.clientHeight + choicesList.clientHeight + "px";
                });
            }, false);

            // ... and then shrinks back to size again.
            element.addEventListener('hideDropdown', function (event) {
                getContainerElements().forEach(function (container) {
                    container.parentElement.style.minHeight = 'unset';
                });
            }, false);

            // Track the scroll position and apply sticky styles to the opt-group elements.
            // The "touchmove" event is used for touch devices, because on some browsers
            // the scroll event is triggered only once after the scroll animation has completed.
            ['scroll', 'touchmove'].forEach(function (eventName) {
                choices.choiceList.addEventListener(eventName, function () {
                    const groups = this.querySelectorAll('.choices__group');
                    const scrollTop = this.scrollTop;

                    groups.forEach(function (group) {
                        var stickyTriggerPoint = group.offsetTop;

                        if (group.hasAttribute('data-offset-top')) {
                            stickyTriggerPoint = group.getAttribute('data-offset-top');
                        }

                        if (scrollTop >= stickyTriggerPoint) {
                            // Save the original offset top, before applying the sticky style.
                            // The value is later used to determine whether the group should
                            // loose its sticky style.
                            if (!group.hasAttribute('data-offset-top')) {
                                group.setAttribute('data-offset-top', group.offsetTop);
                            }

                            group.classList.add('is-sticky');

                            if (group.nextElementSibling) {
                                // Group element's position becomes fixed,
                                // causing the height of the scrollable element to decrease.
                                // The "removed" height is added as a margin top
                                // on the next element in order to compensate for the losses.
                                // This gives a smooth, non-jumping feeling to the end-user.
                                group.nextElementSibling.style.marginTop = group.clientHeight + 'px';
                            }
                        } else {
                            group.classList.remove('is-sticky');
                            group.removeAttribute('data-offset-top');

                            if (group.nextElementSibling) {
                                group.nextElementSibling.style.marginTop = null;
                            }
                        }
                    });
                });
            });
        });
    }

    function parseComponentList(event) {
        var request = event.target;
        if (request.readyState === request.DONE && request.status === 200) {
            prepareComponentList(JSON.parse(request.responseText));
        }
    }

    // When the window has finished loading the DOM, fetch the components and
    // populate the dropdown.
    window.addEventListener('load', function () {
        const request = new XMLHttpRequest();
        request.onreadystatechange = parseComponentList;
        request.open('GET', '//docs.zendframework.com/zf-mkdoc-theme/scripts/zf-component-list.json');
        request.send();
    });
})();
