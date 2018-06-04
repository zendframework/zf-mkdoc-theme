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
                    container.parentElement.style.minHeight = container.clientHeight + 350 + "px";
                });
            }, false);

            // ... and then shrinks back to size again.
            element.addEventListener('hideDropdown', function (event) {
                getContainerElements().forEach(function (container) {
                    container.parentElement.style.minHeight = 'unset';
                });
            }, false);
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
