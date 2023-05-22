//define global variable for form refresh and handle no-refresh on click with iframe
var currentForm;
var confirmation;
var checkmark = '<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>';
$(window).on('load', function () {
    $('form[target="hiddeniframe"] button[type="submit"], form[target="hiddeniframe"] input[type="submit"], form.sg-survey-form input[type="submit"]').mousedown(function () {
        currentForm = $(this).closest('form');
        confirmation = $(this).closest('form').find('input[name="confirmationMessage"]')[0].value;
        if (currentForm[0].className === 'sg-survey-form') {
            setTimeout(handleConfirmation, 1000);
        }
    })
});
//handle form confirmation message and checkmark and scroll
function handleConfirmation() {
    currentForm.before('<div class="show-confirmation">' + checkmark + '<p>' + confirmation + '</p></div>')
    currentForm.css('display', 'none');
    var confirmationDiv = $(currentForm[0].previousElementSibling)[0]
    var currentNavheight = -105 - $('#layout-navigation').height();
    confirmationDiv.scrollIntoView();
    scrollBy(0, currentNavheight);
}

$(document).ready(function () {
    //scroll site on nav or internal link click to top of section/element heading based on navheight
    $('a[href^="#"]:not(.carousel-control-prev):not(.carousel-control-next):not(.collapse-link):not(.nav-link.tabs):not(#tabnavlink)').on('click', function (e) {
        e.preventDefault();
        var navHeight = 0 - $('#layout-navigation').height();
        $($(this).attr('href'))[0].scrollIntoView();
        scrollBy(0, navHeight);
    });
    var width = $(document).width();
    $("a[data-toggle='collapse']").click(function () {
        $(this).children(".arrow").toggle();
    })
    //sticky topnav
    $('.widget-singlepage').Stickyfill();
    //Progress bar
    $(window).scroll(function () {
        var s = $(window).scrollTop(),
              d = $(document).height(),
              c = $(window).height();
        scrollPercent = (s / (d - c)) * 100;
        var position = scrollPercent;
        $("#progressbar").attr('value', position);
    });
    $('.widget-content').magnificPopup({
        delegate: 'a.lightbox', // child items selector, by clicking on it popup will open
        type: 'image'
    });
    $('.carousel').bcSwipe({ threshold: 50 });
});

$(window).on('load', function () {
    //scroll back to section of submitted form
    $('form:not([target="hiddeniframe"]) button[type="submit"], form:not([target="hiddeniframe"]) input[type="submit"]').mousedown(function () {
        if ($(this).closest('.widget-content').find('header h1').attr('id')) {
            var heading = $(this).closest('.widget-content').find('header h1').attr('id');
        } else if ($(this).closest('#footer_wrapper')[0].id) {
            var heading = $(this).closest('#footer_wrapper')[0].id;
        }
        sessionStorage.setItem('heading-start', heading)
    })
    if (sessionStorage.getItem('heading-start')) {
        var headingStart = '#' + sessionStorage.getItem('heading-start');
        var navHeight = 0 - $('#layout-navigation').height();
        if (headingStart != '#footer_wrapper') {
            $('h1' + headingStart)[0].scrollIntoView();
            scrollBy(0, navHeight);
        }
        else if (headingStart === '#footer_wrapper') {
            $(headingStart)[0].scrollIntoView();
            scrollBy(0, 10);
        }
    } else {
    }
});
//adjust accordion spacing on widget-expanding-section
$('article.widget-expanding-section .col-md-8.lead a.collapse-link').click(function () {
    var columnFour = $(this).parent().parent().children('div.col-md-4.lead-image');
    var allChildren = $(this).parent().children();
    var totalHeight = 0;
    for (i = 0; i < allChildren.length; i++) {
        totalHeight += allChildren[i].offsetHeight;
    }
    if ($(window).width() > 768 && $(this)[0].attributes['aria-expanded'].value === 'false') {
        columnFour.css('height', totalHeight);
    } else if ($(window).width() > 768 && $(this)[0].attributes['aria-expanded'].value === 'true') {
        columnFour.css('height', '100%');
    }
})
//set data-offset in scrollspy object to make scrollSpy account for nav height when adjusting active nav
var getOffset = function () {
    return 12 + $('#layout-navigation').height();
};
$(document).ready(function () {
    setTimeout(function () {
        $("body").scrollspy({
            offset: getOffset()
        })
        var initialOffset = $('body').data('bs.scrollspy')._config;
        if (initialOffset.offset === 0) {
            initialOffset.offset = getOffset();
            $('body').scrollspy('refresh');
        }
    }, 600)
});
function updateOffset() {
    var updatedOffset = $('body').data('bs.scrollspy')._config;
    if (updatedOffset.offset != getOffset()) {
        updatedOffset.offset = getOffset();
        $('body').scrollspy('refresh');
    }
}
//scrollspy updated on window resize
$(window).resize(function () {
    setTimeout(function () {
        updateOffset()
    }, 500)
})
//google events for single page sections
var endOfPage;
var sectionArray = [];
var sectionNumber = 1;
var totalSections = $('article.widget-content').length;
var sectionPercent;

$(document).scroll(function () {
    var distanceFromBottom = Math.floor($(document).height() - $(document).scrollTop() - $(window).height());
    if ((distanceFromBottom === 0) && (!sessionStorage.getItem('end-of-page'))) {
        ga('send', 'event', 'section', 'end of page');
        sessionStorage.setItem('end-of-page', 'reached');
    }
    $("#content article.widget h1:first-of-type").each(function () {
        headingTitle = $(this).attr('id');
        if (sessionStorage.getItem('section-name')) {
            sectionArray = sessionStorage.getItem('section-name').split(',');
        }
        if (($(window).scrollTop() >= $(this).offset().top) && (headingTitle) && (sectionArray.indexOf(headingTitle) === -1)) {
            ga('send', 'event', 'section', $(this)[0].innerText);
            sectionPercent = parseFloat((sectionNumber / totalSections * 100).toFixed(2));
            ga('send', { 'hitType': 'event', 'eventCategory': 'section-percents', 'eventValue': sectionPercent });
            ga('send', { 'hitType': 'event', 'eventCategory': 'section-numbers', 'eventValue': 'Section ' + sectionNumber });
            if (sessionStorage.getItem('section-name')) {
                var sectionString = sessionStorage.getItem('section-name') + ',' + headingTitle;
                sessionStorage.setItem('section-name', sectionString);
                sectionNumber++;
            } else {
                sessionStorage.setItem('section-name', headingTitle);
                ga('send', { 'hitType': 'event', 'eventCategory': 'total-sections', 'eventValue': totalSections });
                sectionNumber++;
            }

        }
    });
});