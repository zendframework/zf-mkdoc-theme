/* Highlight */
$(function () {
    $('table').addClass('table table-striped table-hover');
});

$('body').scrollspy({
    target: '.bs-sidebar'
});

/* Prevent disabled links from causing a page reload */
$("li.disabled a").click(function (e) {
    e.preventDefault();
});

(function () {
    "use strict";
    anchors.options.placement = 'left';
    anchors.add('.docs h1, .docs h2, .docs h3, .docs h4, .docs h5');
})();
