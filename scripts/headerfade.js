$(document).ready(function () {
    $(window).scroll(function () {
      if ($(window).scrollTop() >= $("#tilehead").offset().top - $(window).height() / 2) {
        $("#headerfade").fadeIn(1000, function () {
          $("#subheaderfade").fadeIn(1000);
        });
      }
    });
  });
  