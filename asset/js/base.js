(function () {
    "use strict";

    // Tables
    var tables = document.querySelectorAll('.content tables');
    if (tables.length) {
        tables.classList.add('table table-striped table-hover');
    }

    // Anchors
    anchors.options.placement = 'left';
    anchors.add(
        '.content h1:not(.content__title), .content h2, .content > h3, .content h4, .content h5'
    );

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
