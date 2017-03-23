/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('body').on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

// girl code - fancy effects when scrolling past things

var wasScrolledBelow = false;

function isScrolledBelow($el) {
    var topofDiv = $el.offset().top + $el.outerHeight();
    return $(window).scrollTop() + $(window).height() > topofDiv;
}


//hack to make spinners wobble when scrolled on screen
var spinnersScrolledBelow = false;
var spinnersTrigger = $($(".mg-spin").get(0));

var animTrigger = $(".animatedList");
var animItems = $(".animatedList li");
var animTimeouts = [];
animItems.addClass("off-left");
animItems.addClass("slide-in");

if (animTrigger.length > 0) {
  $(window).scroll(function(){
      var isBelow = isScrolledBelow(animTrigger);
      if (isBelow && !wasScrolledBelow) {
          console.log("show");
          wasScrolledBelow = true;
          animItems.each(function (i) {
              var that = this;
              animTimeouts.push(setTimeout(function () {
                  $(that).removeClass("off-left");
              }, 200 * i));
          });
      } else if (!isBelow && wasScrolledBelow) {
          //reset
          console.log("hide");
          animTimeouts.forEach(function (id) {
              clearTimeout(id);
          });
          animTimeouts = [];
          wasScrolledBelow = false;
          animItems.addClass("off-left");
      }

      var isBelow2 = isScrolledBelow(spinnersTrigger);
      if (isBelow2 && !spinnersScrolledBelow) {
          console.log("bump");
          spinnersScrolledBelow = true;
          bumpSpinners();
      } else if (!isBelow2 && spinnersScrolledBelow) {
          spinnersScrolledBelow = false;
      }
  });
}
