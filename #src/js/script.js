const body = document.querySelector('body');
$(document).ready(function () {
	$('.header__burger').click(function (event) {
		$('.header__burger, .header__menu').toggleClass('active');
		$('body').toggleClass('lock');
	});

});

//прелоадер
window.onload = function () {
	document.body.classList.add('loaded_hiding');
	window.setTimeout(function () {
		document.body.classList.add('loaded');
		document.body.classList.remove('loaded_hiding');
	}, 500);
};
//@prepros-append mail.js
//@prepros-append scroll.js

//слайдеры
let reviewSlider = new Swiper('.slider__wrapper', {

	spaceBetween: 40,
	centeredSlides: true,
	slidePerView: 1,
	autoHeight: true,
	speed: 600,
	loop: true,
	pagination: {
		el: '.swiper-pagination',
		type: 'bullets',
		clickable: true,
	},

	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});
let portfolioSlider = new Swiper('.portfolio__slider', {

	spaceBetween: 10,
	speed: 550,
	loop: true,
	loopedSlides: 2,
	pagination: {
		el: '.swiper-pagination',
		type: 'bullets',
		clickable: true,
	},

	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	breakpoints: {
		600: {
			slidesPerView: 2,
			slidesPerGroup: 2,
			autoHeight: false,
		},
	},

});