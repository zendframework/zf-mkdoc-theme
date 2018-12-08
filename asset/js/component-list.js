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
                searchPlaceholderValue: 'Jump to package…',
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

            // Load all starting and ending points for the sticky scene.
            // After all of them have loaded, toggle the sticky styles accordingly.
            element.addEventListener('showDropdown', function (event) {
                const groups = choices.choiceList.querySelectorAll('.choices__group');

                groups.forEach(function (group, index) {
                    var stickyStart = group.offsetTop;
                    var stickyEnd = null;

                    if (groups.hasOwnProperty(index + 1)) {
                        var nextGroup = groups[index + 1];
                        stickyEnd = nextGroup.offsetTop;
                    }

                    group.setAttribute('data-sticky-start', stickyStart);
                    group.setAttribute('data-sticky-end', stickyEnd ? stickyEnd : '');
                });

                groups.forEach(function (group) {
                    toggleStickyGroupStyles(group, choices.choiceList.scrollTop);
                });
            }, false);

            // Remove all sticky styles when the drop-down hides
            element.addEventListener('hideDropdown', function (event) {
                const groups = choices.choiceList.querySelectorAll('.choices__group');

                groups.forEach(function (group) {
                    unsetStickyGroupStyles(group);
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
                        toggleStickyGroupStyles(group, scrollTop);
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

    function toggleStickyGroupStyles(group, scrollTop) {
        var stickyStart = parseInt(group.getAttribute('data-sticky-start'));
        var stickyEnd = group.getAttribute('data-sticky-end')
            ? parseInt(group.getAttribute('data-sticky-end'))
            : null;

        if (scrollTop >= stickyStart && (scrollTop <= stickyEnd || !stickyEnd)) {
            setStickyGroupStyles(group);
            return;
        }

        unsetStickyGroupStyles(group);
    }

    function setStickyGroupStyles(group) {
        group.classList.add('is-sticky');

        if (group.nextElementSibling) {
            // Group element's position becomes fixed,
            // causing the height of the scrollable element to decrease.
            // The "removed" height is added as a margin top
            // on the next element in order to compensate for the losses.
            // This gives a smooth, non-jumping feeling to the end-user.
            group.nextElementSibling.style.marginTop = group.clientHeight + 'px';
        }
    }

    function unsetStickyGroupStyles(group) {
        group.classList.remove('is-sticky');

        if (group.nextElementSibling) {
            group.nextElementSibling.style.marginTop = null;
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
