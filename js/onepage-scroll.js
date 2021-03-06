!function($){

  var defaults = {
    sectionContainer: "section",
    easing: "ease",
    animationTime: 1000,
    pagination: true,
    updateURL: false
	}; // default setting

	// $.fn.swipeEvents = function() {
 //    return this.each(function() {

 //      var startX,
 //          startY,
 //          $this = $(this);

 //      $this.bind('touchstart', touchstart);

 //      function touchstart(event) {
 //        var touches = event.originalEvent.touches;
 //        if (touches && touches.length) {
 //          startX = touches[0].pageX;
 //          startY = touches[0].pageY;
 //          $this.bind('touchmove', touchmove);
 //        }
 //        event.preventDefault();
 //      }

 //      function touchmove(event) {
 //        var touches = event.originalEvent.touches;
 //        if (touches && touches.length) {
 //          var deltaX = startX - touches[0].pageX;
 //          var deltaY = startY - touches[0].pageY;

 //          if (deltaX >= 50) {
 //            $this.trigger("swipeLeft");
 //          }
 //          if (deltaX <= -50) {
 //            $this.trigger("swipeRight");
 //          }
 //          if (deltaY >= 50) {
 //            $this.trigger("swipeUp");
 //          }
 //          if (deltaY <= -50) {
 //            $this.trigger("swipeDown");
 //          }
 //          if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
 //            $this.unbind('touchmove', touchmove);
 //          }
 //        }
 //        event.preventDefault();
 //      }

 //    });
 //  };

  $.fn.onepageScroll = function(options){
    var settings = $.extend({}, defaults, options),
        el = $(this),
        sections = $(settings.sectionContainer)
        total = sections.length,
        status = "off",
        topPos = 0,
        lastAnimation = 0,
        quietPeriod = 500,
        paginationList = "";

    $.fn.transformPage = function(settings, pos) {
      $(this).css({
        "-webkit-transform": "translate3d(0, " + pos + "%, 0)",
        "-webkit-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "-moz-transform": "translate3d(0, " + pos + "%, 0)",
        "-moz-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "-ms-transform": "translate3d(0, " + pos + "%, 0)",
        "-ms-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "transform": "translate3d(0, " + pos + "%, 0)",
        "transition": "all " + settings.animationTime + "ms " + settings.easing
      });
    }

    $.fn.moveDown = function() {
      var el = $(this)
      index = $(settings.sectionContainer +".active").data("index");
      if(index < total) {
        current = $(settings.sectionContainer + "[data-index='" + index + "']");
        next = $(settings.sectionContainer + "[data-index='" + (index + 1) + "']");
        if(next) {
          current.removeClass("active")
          next.addClass("active");
          if(settings.pagination == true) {
            $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
            $(".onepage-pagination li a" + "[data-index='" + (index + 1) + "']").addClass("active");
          }
          $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
          $("body").addClass("viewing-page-"+next.data("index"))
        }
        pos = (index * 100) * -1;
        el.transformPage(settings, pos);
      }
    }

    $.fn.moveUp = function() {
      var el = $(this)
      index = $(settings.sectionContainer +".active").data("index");
      if(index <= total && index > 1) {
        current = $(settings.sectionContainer + "[data-index='" + index + "']");
        next = $(settings.sectionContainer + "[data-index='" + (index - 1) + "']");

        if(next) {
          current.removeClass("active")
          next.addClass("active")
          if(settings.pagination == true) {
            $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
            $(".onepage-pagination li a" + "[data-index='" + (index - 1) + "']").addClass("active");
          }
          $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
          $("body").addClass("viewing-page-"+next.data("index"))
        }
        pos = ((next.data("index") - 1) * 100) * -1;
        el.transformPage(settings, pos);
      }
    }

    function init_scroll(event, delta) {
        deltaOfInterest = delta;
        var timeNow = new Date().getTime();

        // Cancel scroll if currently animating or within quiet period
        if(timeNow - lastAnimation < quietPeriod + settings.animationTime) {
          event.preventDefault();
          return;
        }

        // use deltaOfInterest to decide direction
        if (deltaOfInterest < 0) {
          el.moveDown()
        } else {
          el.moveUp()
        }
        lastAnimation = timeNow;
    }

    // Prepare everything before binding wheel scroll
    el.addClass("onepage-wrapper").css("position","relative");
    $.each( sections, function(i) {
      $(this).css({
        position: "absolute",
        top: topPos + "%"
      }).addClass("section").attr("data-index", i+1);
      topPos = topPos + 100;
      if(settings.pagination == true)
        paginationList += "<li><a data-index='"+(i+1)+"' href='#" + (i+1) + "'></a></li>";
    });

    // el.swipeEvents().bind("swipeDown",  function(){
    //   el.moveUp();
    // }).bind("swipeUp", function(){
    //   el.moveDown();
    // });

    // Create Pagination and Display Them
    if(settings.pagination == true) {
      $("<ul class='onepage-pagination'>" + paginationList + "</ul>").prependTo("body");
      posTop = (el.find(".onepage-pagination").height() / 2) * -1;
      el.find(".onepage-pagination").css("margin-top", posTop);
    }

    // if someone using url to change the pagination
    if(window.location.hash != "" && window.location.hash != "#1") {
      init_index =  window.location.hash.replace("#", "");
      $(settings.sectionContainer + "[data-index='" + init_index + "']").addClass("active");
      $("body").addClass("viewing-page-"+ init_index);
      if(settings.pagination == true)
      	$(".onepage-pagination li a" + "[data-index='" + init_index + "']").addClass("active");
      next = $(settings.sectionContainer + "[data-index='" + (init_index) + "']");
      if(next) {
        next.addClass("active");
        if(settings.pagination == true)
        	$(".onepage-pagination li a" + "[data-index='" + (init_index) + "']").addClass("active");
        $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
        $("body").addClass("viewing-page-"+next.data("index"));
      }
      pos = ((init_index - 1) * 100) * -1;
      el.transformPage(settings, pos);
    }else{
      $(settings.sectionContainer + "[data-index='1']").addClass("active");
      $("body").addClass("viewing-page-1");
      if(settings.pagination == true)
      	$(".onepage-pagination li a" + "[data-index='1']").addClass("active");
    }

    // click pagination function
    if(settings.pagination == true)  {
      $(".onepage-pagination li a").click(function (){
        var page_index = $(this).data("index");
        if (!$(this).hasClass("active")) {
          current = $(settings.sectionContainer + ".active");
          next = $(settings.sectionContainer + "[data-index='" + (page_index) + "']");
          if(next) {
            current.removeClass("active");
            next.addClass("active");
            $(".onepage-pagination li a" + ".active").removeClass("active");
            $(".onepage-pagination li a" + "[data-index='" + (page_index) + "']").addClass("active");
            $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
            $("body").addClass("viewing-page-"+next.data("index"))
          }
          pos = ((page_index - 1) * 100) * -1;
          el.transformPage(settings, pos);
        }
        if (settings.updateURL == false) return false;
      });
    }

    // mouseweel or DOMMouseScroll for firefox with throttle
    $(document).bind('mousewheel DOMMouseScroll', throttle(function(event) {
      event.preventDefault();
      var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
      init_scroll(event, delta);
    }, 150));
    return false;

    // throttle event function
    function throttle(fn, threshhold, scope) {
      // default 250 ms if not setting
      threshhold || (threshhold = 250);
      var last,
          deferTimer;
      return function () {
        var context = scope || this;

        var now = +new Date,
            args = arguments;
        if (last && now < last + threshhold) {
          // hold on to it
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function () {
            last = now;
            fn.apply(context, args);
          }, threshhold);
        } else {
          last = now;
          fn.apply(context, args);
        }
      };
    }

    // debounce event function
    function debounce(fn, delay) {
      var timer = null;
      return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      };
    }
  }
}(window.jQuery);


$(function(){
  // setting
	$(".main").onepageScroll({
    sectionContainer: "section",
    easing: "ease",
    animationTime: 1000,
    pagination: true,
    updateURL: false
  });
})


