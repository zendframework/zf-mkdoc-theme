(function () {
    "use strict";

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
        // document.getElementsByClassName('component-selector__control');
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
            choices.passedElement.addEventListener('choice', function (event) {
                window.location.href = event.detail.choice.value;
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
