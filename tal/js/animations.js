$(document).ready(function () {
	wizardPosition();

	$('.btn-round').click(function (e) {
		e.preventDefault();
		theClickEvent($(this));
	});

	$('.btn-round-little').click(function (e) {
		e.preventDefault();
		var a = $(this);

		a.children('.btn-content-little').animate({
				backgroundColor: '#ff9943',
				color: '#fff'
		}, 50, function() {
			var elem = a.get(0);
			do_click(elem);
		});
	});

});

function do_click(elem) {
	var ok = true;
	if(elem.click_func !== undefined) {
		ok = elem.click_func();
	}
	return ok;
}

function theClickEvent(a) {
	a.children('.btn-content').animate({
		backgroundColor: '#ff9943',
		color: '#fff'
	}, 50, function() {
		$(this).animate({
			opacity: 0
		}, 30, function() {
			var elem = a.get(0);
			if(do_click(elem)) {
				if (a.is('a')) {
					window.location.href = a.attr('href');
				} else if (a.is('button')) {
					if (a.is('#error-button')) {
						closeError();
					} else {
						a.trigger('submit');
					}
				};
			}

			// If form submit has an error and user stays on same page, then buttons reappears
			$(this).delay(500).animate({
				backgroundColor: '#ff9943',
				color: '#fff',
				opacity: 1
			}, 100);
		});
	});
}

function errorMsg(errorTxt) {
	var errorHtml = '<div id="error-wrapper" style="opacity: 0;"><div class="error-box">';
	errorHtml += '<header class="error-box-header"><button type="button" id="error-close"><span class="sr-only">Close</span></button></header>';
	errorHtml += '<div class="error-box-content">';
	errorHtml += errorTxt;
	errorHtml += '</div>';
	errorHtml += '<footer class="error-box-footer"><button id="error-button" type="button" class="btn-round btn-check">';
	errorHtml += '<span class="btn-content">Ok</span></button><div class="label-btn">Ok</div>';
	errorHtml += '</footer></div></div>';

	$('#content').after(errorHtml);

	$('#error-close').click(closeError);
	$('#error-button').click(function() {
		theClickEvent($(this));
	});

	$('#error-wrapper').animate({
		opacity: 1
	}, 200);
}

function closeError() {
	$('#error-wrapper').animate({
		opacity: 0
	}, 200, function() {
		$(this).remove();
	});
}

function wizardPosition() {
	var windowHeight = $(window).height();
	var documentHeight = $('body').height();

	if (windowHeight >= documentHeight) {
		$('.wizard').css({
			position: 'absolute',
			bottom: 0,
			left: 0,
			right: 0
		});
	} else {
		$('.wizard').css({
			position: 'static'
		});
	}
}
