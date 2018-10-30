// Web Fonts

  WebFontConfig = {
    google: { families: [ 'Copse:latin', 'Lato:100,300,400,700:latin', 'Josefin+Slab:400:latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();

// Event Calendar Pop up

  jQuery(document).ready(function($) {
	
	$("table.tec-calendar .tec-event a").hover(function() {
		
		// one for IE6, one for everybody else
		if ($.browser.msie && $.browser.version == 6.0) {
			var bottomPad = $(this).parents("td").outerHeight() + 5;
		}
		else {
			var bottomPad = $(this).outerHeight() + 10;
		}
		
		$(this).find(".tec-tooltip").stop(true, true).css('bottom', bottomPad).fadeIn(300);
	}, function() {
		$(this).find(".tec-tooltip").stop(true, true).fadeOut(100);
	});
	
	
	$("table.tec-calendar .tec-event a").click(function() {
		$(this).find(".tec-tooltip").fadeOut(100);
	});
});

// Fancy Box

$(function() {
	$("a.zoom").fancybox();
	$("img.zoom").parent().fancybox();
	$(".gallery img").parent().fancybox();
});

// Extend Search Box

$(document).ready(function() {
if ($(window).width() < 600) {
} else {
	$(function() {
		$('header input#s').focus(function(){
		   $(this).animate({width:'120px'}, 100);
		});
	});
	$(function() {
		$('header input#s').blur(function(){
			$(this).animate({width:'22px'}, 100)
		});
	});
}
});

// Form Focus
$(function(){
	$("input,textarea").focus(function(){
		$(this).addClass("focus");
	});
});
$(function(){
	$("input,textarea").blur(function(){
		$(this).removeClass("focus");
	});
});


// Tabs

$(function(){
	$(".tab-content").hide();
	$("ul.tabs li:first").addClass("active").show(); 
	$(".tab-content:first").show();
	
	$("ul.tabs li").click(function() {
		$("ul.tabs li").removeClass("active");
		$(this).addClass("active"); 
		$(".tab-content").hide(); 
		var activeTab = $(this).find("a").attr("href"); 
		$(activeTab).fadeIn(); 
		return false;
	});

});

// Back to top

$(function(){
    $('#btt a').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
        && location.hostname == this.hostname) {
            var $target = $(this.hash);
            $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
            if ($target.length) {
                var targetOffset = $target.offset().top;
                $('html,body').animate({scrollTop: targetOffset}, 1000);   
                return false; 
            } 
        } 
    }); 
});

// Announcement

$(function(){
    var $announcetab = $('#a-panel');
    $announcetab.css({
      marginLeft: -$announcetab.outerWidth() + 'px',
      display: 'block'
    });
    
    $('#a-tab').click(function() {
	  $(this).toggleClass('active');
	  if ( $(this).hasClass('active') ) {
				$(this).stop().animate({left:'-105px'},0);
			}
      $announcetab.animate({
        marginLeft: parseInt($announcetab.css('marginLeft'),10) == 0 ?
        -$announcetab.outerWidth() : 0
      },200);
	});
  }); 

$(function(){  
	$('#a-tab').hover(function() { 
		if ( $(this).hasClass('active') ) {
				$(this).stop().animate({left:'-105px'},0);
			} else {
				$(this).stop().animate({left:'0'},200);
			}
		},function(){ 
		$(this).stop().animate({left:'-105px'},200);
	});
});

// News Panel Sliders

$(function(){
	//To switch directions up/down and left/right just place a "-" in front of the top/left attribute
	//Banner Slider Small
	$('.panel.peek').hover(function(){
		$(".cover", this).stop().animate({top:'0'},{queue:false,duration:300});
	}, function() {
		$(".cover", this).stop().animate({top:'135px'},{queue:false,duration:300});
	});
	
});

// Max out table widths

$(function(){
	if ($('.entry-content table').width() >= 600)
{
     $('.entry-content table').attr('width', '100%');
}
});

(function(doc) {

	var addEvent = 'addEventListener',
	    type = 'gesturestart',
	    qsa = 'querySelectorAll',
	    scales = [1, 1],
	    meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

	function fix() {
		meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
		doc.removeEventListener(type, fix, true);
	}

	if ((meta = meta[meta.length - 1]) && addEvent in doc) {
		fix();
		scales = [.25, 1.6];
		doc[addEvent](type, fix, true);
	}

}(document));