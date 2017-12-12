(function () {
    "use strict";

    // Tables
    var tables = document.querySelectorAll('.content table');
    if (tables.length) {
        tables.forEach(function (element) {
            element.classList.add('table', 'table-striped', 'table-hover');
        });
    }

    // Anchors
    anchors.options.placement = 'left';
    anchors.add(
        '.content h1:not(.content__title), .content h2, .content > h3, .content h4, .content h5'
    );

    // Search modal (search modal is not yet available in the DOM)
    window.setTimeout(function () {
        $('#mkdocs_search_modal').on('shown.bs.modal', function () {
            $('#mkdocs-search-query').focus();
        });
    }, 1000);

    var shiftWindow = function () {
        scrollBy(0, -50)
    };
    if (location.hash) {
        shiftWindow();
    }
    window.addEventListener('hashchange', shiftWindow);

    // Remove fixed position if subnavigation is bigger than content
    var contentElement       = document.querySelector('.content');
    var subnavigationElement = document.querySelector('.subnavigation');
    if (contentElement && subnavigationElement
        && contentElement.clientHeight < subnavigationElement.clientHeight
    ) {
        subnavigationElement.classList.remove('affix')
    }
})();
