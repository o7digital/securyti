(function($) {
    "use strict";

    function initStellar() {
        if (typeof $.stellar === 'function' && $('.pxl-section-bg-parallax.pxl--parallax').length) {
            $(window).stellar({
                horizontalScrolling: false,
                verticalScrolling: true,
                responsive: true
            });
        }
    }

    // Frontend thường
    $(document).ready(function() {
        initStellar();
    });

    // Khi Elementor Editor render section
    $(window).on('elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction('frontend/element_ready/section', function() {
            initStellar();
        });
    });

})(jQuery);