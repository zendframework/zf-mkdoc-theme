(function () {
    "use strict";

    var componentSelectors;

    function injectComponent(name, url) {
        componentSelectors.forEach(function(element) {
            var optionGroups = element.getElementsByTagName('optgroup');
            if (optionGroups.length === 0) {
                return;
            }

            // Create option element
            var option = document.createElement('option');
            option.setAttribute('value', url);
            option.textContent = name;

            // Selected?
            // eslint-disable-next-line no-use-before-define
            if (url.indexOf(siteName) !== -1) {
                option.setAttribute('selected', 'selected');
            }

            if (name === 'tutorials') {
                // Update text content
                option.textContent = name.charAt(0).toUpperCase() + name.slice(1);

                // Insert
                element.insertBefore(option, optionGroups[0]);
                return;
            }

            // Append
            optionGroups[0].appendChild(option);
        });
    }

    function parseComponentList(event) {
        var request = event.target;
        if (request.readyState === request.DONE && request.status === 200) {
            var components = JSON.parse(request.responseText);
            components.forEach(function (element) {
                var name = element.package;
                name     = name.substring(name.indexOf('/') + 1);

                injectComponent(name, element.url);
            });
        }
    }

    function loadComponentList() {
        var request                = new XMLHttpRequest();
        request.onreadystatechange = parseComponentList;
        request.open('GET', '//docs.zendframework.com/zf-mkdoc-theme/scripts/zf-component-list.json');
        request.send();
    }

    function getComponentSelectors() {
        var selectors = [];
        const nodeList = document.querySelectorAll('.component-selector__control');
        for (var i = 0; i < nodeList.length; i += 1) {
            selectors.push(nodeList[i]);
        }
        return selectors;
    }

    componentSelectors = getComponentSelectors();
    if (componentSelectors.length === 0) {
        return;
    }

    loadComponentList();

    // Add event listener
    componentSelectors.forEach(function(element) {
        element.addEventListener('change', function (event) {
            // Get value
            var value = event.target.value;
            if (value.length === 0) {
                return;
            }

            // Navigate to component
            window.location.href = value;
        });
    });
})();
