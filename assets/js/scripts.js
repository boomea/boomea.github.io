
function scroll_to(clicked_link, nav_height) {
	var element_class = clicked_link.attr('href').replace('#', '.');
	var scroll_to = 0;
	if(element_class != '.top-content') {
		element_class += '-container';
		scroll_to = $(element_class).offset().top - nav_height;
	}
	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 1000);
	}
}


jQuery(document).ready(function() {
	
	/*
	    Navigation
	*/
	$('a.scroll-link').on('click', function(e) {
		e.preventDefault();
		scroll_to($(this), $('nav').height());
	});
	// show/hide menu
	$('.show-menu a').on('click', function(e) {
		e.preventDefault();
		$(this).fadeOut(100, function(){ $('nav').slideDown(); });
	});
	$('.hide-menu a').on('click', function(e) {
		e.preventDefault();
		$('nav').slideUp(function(){ $('.show-menu a').fadeIn(); });
	});	
	
    /*
        Fullscreen background
    */
	$('.top-content').backstretch("assets/img/backgrounds/1.jpg");
	$('.video-container').backstretch("assets/img/backgrounds/1.jpg");
	$('.about-us-container').backstretch("assets/img/backgrounds/1.jpg");
	$('.contact-container').backstretch("assets/img/backgrounds/2.jpg");
    
    /*
        Wow
    */
    new WOW().init();
    
    /*
        Screenshots
    */
    var img_index = 1;
    $('.screenshots-box img').each(function(){
    	$(this).addClass('screenshot-img-' + img_index);
    	$('.screenshots-nav').append('<span class="screenshots-nav-item-' + img_index + '"></span>');
    	if($(this).hasClass('screenshot-img-active')) {
    		$('.screenshots-nav-item-' + img_index).addClass('screenshots-nav-item-active');
    	}
    	img_index++;
    });
    // change screenshot
    $(document).on('click', '.screenshots-nav span', function(){
    	if(!($(this).hasClass('screenshots-nav-item-active'))) {
    		$('.screenshots-nav span').removeClass('screenshots-nav-item-active');
    		var clicked_nav_index = $(this).attr('class').replace('screenshots-nav-item-', '');
    		$(this).addClass('screenshots-nav-item-active');
    		$('.screenshots-box img.screenshot-img-active').fadeOut(300, function(){
    			$(this).removeClass('screenshot-img-active');
    			$('.screenshots-box img.screenshot-img-' + clicked_nav_index).fadeIn(400, function(){
    				$(this).addClass('screenshot-img-active');
    			});
    		});
    	}
    });
	
	/*
	    Testimonials
	*/
	$('.testimonial-active').html('<p>' + $('.testimonial-single:first p').html() + '</p>');
	$('.testimonial-single:first .testimonial-single-image img').css('opacity', '1');
	
	$('.testimonial-single-image img').on('click', function() {
		$('.testimonial-single-image img').css('opacity', '0.5');
		$(this).css('opacity', '1');
		var new_testimonial_text = $(this).parent('.testimonial-single-image').siblings('p').html();
		$('.testimonial-active p').fadeOut(300, function() {
			$(this).html(new_testimonial_text);
			$(this).fadeIn(400);
		});
	});
	
	/*
	    Subscription form
	*/
	$('.success-message').hide();
	$('.error-message').hide();

	/*
	    Contact form
	*/
	$('.contact-form form input[type="text"], .contact-form form textarea').on('focus', function() {
		$('.contact-form form input[type="text"], .contact-form form textarea').removeClass('contact-error');
	});
    
});



jQuery(window).load(function() {
	
	/*
	    Loader
	*/
    $('.loader-img').fadeOut();
    $('.loader').fadeOut('slow');
    
    /*
		Screenshots
	*/
	$(".screenshots-box img").attr("style", "width: auto !important; height: auto !important;");
    
    ajaxMailChimpForm($(".newsletter-form"), $("#subscribe-result"));
    // Turn the given MailChimp form into an ajax version of it.
    // If resultElement is given, the subscribe result is set as html to
    // that element.
    function ajaxMailChimpForm($form, $resultElement){
        // Hijack the submission. We'll submit the form manually.
        $form.submit(function(e) {
            e.preventDefault();
            if (!isValidEmail($form)) {
                var error =  "A valid email address must be provided.";
                $resultElement.html(error);
                $resultElement.css("color", "red");
            } else {
                $resultElement.css("color", "inherit");
                $resultElement.html("Subscribing...");
                submitSubscribeForm($form, $resultElement);
            }
        });
    }
    // Validate the email address in the form
    function isValidEmail($form) {
        // If email is empty, show error message.
        // contains just one @
        var email = $form.find("input[name='EMAIL']").val();
        if (!email || !email.length) {
            return false;
        } else if (email.indexOf("@") == -1) {
            return false;
        }
        return true;
    }
    // Submit the form with an ajax/jsonp request.
    // Based on http://stackoverflow.com/a/15120409/215821
    function submitSubscribeForm($form, $resultElement) {
        $.ajax({
            type: "GET",
            url: $form.attr("action"),
            data: $form.serialize(),
            cache: false,
            dataType: "jsonp",
            jsonp: "c", // trigger MailChimp to return a JSONP response
            contentType: "application/json; charset=utf-8",
            error: function(error){
                // According to jquery docs, this is never called for cross-domain JSONP requests
            },
            success: function(data){
                if (data.result != "success") {
                    var message = data.msg || "Sorry. Unable to subscribe. Please try again later.";
                    $resultElement.css("color", "red");
                    if (data.msg && data.msg.indexOf("already subscribed") >= 0) {
                        message = "You're already subscribed. Thank you.";
                        $resultElement.css("color", "inherit");
                    }
                    $resultElement.html(message);
                } else {
                    $resultElement.css("color", "inherit");
                    $resultElement.html("Thank you!<br>To recieve your gift, you must confirm the subscription in your inbox.");
                }
            }
        });
    }
});

