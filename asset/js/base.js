(function () {
    "use strict";

    // Tables
    var tables = document.querySelectorAll('.content table');
    if (tables.length) {
        [].forEach.call(tables, function(element) {
            element.classList.add('table', 'table-striped', 'table-hover');
        });
    }

    // Pre elements
    var preElements = document.querySelectorAll('pre');
    [].forEach.call(preElements, function(element) {
        element.classList.add('line-numbers');
    });

    // Search modal
    $('#mkdocs_search_modal').on('shown.bs.modal', function () {
        $('#mkdocs-search-query').focus();
    });

    // Shift window
    var shiftWindow = function () {
        scrollBy(0, -50)
    };
    if (location.hash) {
        shiftWindow();
    }
    window.addEventListener('hashchange', shiftWindow);
})();
