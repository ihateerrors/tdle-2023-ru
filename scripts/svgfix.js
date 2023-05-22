/**
 * RWD-1452: SVG icons aren't showing on Safari
 *
 * Basically Drupal / CKEditor is stripping <svg><use xlink:href="..."></use></svg> to
 * <svg><use href="..."></use></svg>
 *
 * However, xlink:href is deprecated and only Safari and some old mobile browser is looking for it. Chrome and other
 * browsers do support <use href="..."></use> instead.
 *
 * @see https://css-tricks.com/on-xlinkhref-being-deprecated-in-svg/
 */


(function($) {
    var SvgFix = {
        init: function() {
            this.addXlink();
        },

        addXlink: function() {
            $('svg use').each(function() {
                if ($(this).is(':empty')) {
                    $(this).attr("xlink:href", $(this).attr("href") );
                    $(this).removeAttr('href');
                    var $svg_el = $(this).parent();
                    // Safari wouldn't reload the SVG even the path is changed.
                    // Force refresh (https://stackoverflow.com/a/14457001).
                    $svg_el.html($svg_el.html());
                }
            });
        }
    };

    SvgFix.init();
})(jQuery);