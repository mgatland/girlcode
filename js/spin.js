'use strict';

var spinners = [];

$(".mg-spin").each(function (i, s) {
	spinners.push(s);
	s.rotation = 0;
	s.spinning = false;
	s.momentum = 0;
	s.spinTime = 0;
});

$(".mg-spin").hover(
	function(e) {
		e.target.spinning = true;
	},
	function(e) {
		e.target.spinning = false;
		}
	);

var rotate = function(s, degrees) {
	s.rotation += degrees;
	while (s.rotation > 360) s.rotation -= 360;
	while (s.rotation < 0) s.rotation += 360;

    $(s).css({'-webkit-transform' : 'rotate('+ s.rotation +'deg)',
                 '-moz-transform' : 'rotate('+ s.rotation +'deg)',
                 '-ms-transform' : 'rotate('+ s.rotation +'deg)',
                 'transform' : 'rotate('+ s.rotation +'deg)'});
};

var updateSpinner = function () {
	spinners.forEach(function (s) {
		if (s.spinning) {
			if (s.momentum < 4) s.momentum = 4;
			rotate(s, s.momentum);
			s.spinTime++;
			if (s.spinTime > 120) {
				s.momentum += 0.016;
			}
		} else {
			s.spinTime = 0;
			s.momentum *= 0.94;
			if (s.rotation < -1 || s.rotation > 1) {
				s.momentum += (s.rotation > 180) ? 0.7 : -0.7;
			}
			rotate(s, s.momentum);
			//settle
			if (s.rotation > -1 && s.rotation < 1 && s.momentum > -2 && s.momentum < 2) {
				s.momentum = 0;
				s.rotation = 0;
				rotate(s, 0);
			}
		}
	});
	requestAnimationFrame(updateSpinner);
};
updateSpinner();
