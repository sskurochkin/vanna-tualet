"use strict";

const body = document.querySelector('body');
$(document).ready(function () {
  $('.header__burger').click(function (event) {
    $('.header__burger, .header__menu').toggleClass('active');
    $('body').toggleClass('lock');
  });
}); //прелоадер

window.onload = function () {
  document.body.classList.add('loaded_hiding');
  window.setTimeout(function () {
    document.body.classList.add('loaded');
    document.body.classList.remove('loaded_hiding');
  }, 500);
}; //слайдеры


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
    clickable: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  }
});
let portfolioSlider = new Swiper('.portfolio__slider', {
  spaceBetween: 10,
  speed: 550,
  loop: true,
  loopedSlides: 2,
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  breakpoints: {
    600: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      autoHeight: false
    }
  }
}); //send mail

let requestForm = document.querySelector('.request-form');

function send(event, php) {
  event.preventDefault();
  let form = event.target;
  let error = formValidate(form);

  function formValidate(form) {
    let error = 0;
    let formReq = form.querySelectorAll('._req');

    for (let index = 0; index < formReq.length; index++) {
      const input = formReq[index];
      formRemoveError(input);

      if (input.classList.contains('_email')) {
        if (emailTest(input)) {
          formAddError(input);
          error++;
        }
      } else if (input.classList.contains('_phone')) {
        if (phoneTest(input)) {
          formAddError(input);
          error++;
        }
      } else {
        if (input.value === '') {
          formAddError(input);
          error++;
        }
      }
    }

    return error;
  }

  function formAddError(input) {
    input.classList.add('_error');
  }

  function formRemoveError(input) {
    input.classList.remove('_error');
  }

  function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  }

  function phoneTest(input) {
    return /^(\+375)\((29|25|44|33)\)[0-9]{2}[0-9]{2}[0-9]{3}$/.test(input.value);
  }

  if (error === 0) {
    console.log("Отправка запроса");
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
    var req = new XMLHttpRequest();
    req.open('POST', php, true);

    req.onload = function () {
      if (req.status >= 200 && req.status < 400) {
        let json = JSON.parse(this.response); // Ебанный internet explorer 11
        // ЗДЕСЬ УКАЗЫВАЕМ ДЕЙСТВИЯ В СЛУЧАЕ УСПЕХА ИЛИ НЕУДАЧИ

        if (json.result == "success") {
          // Если сообщение отправлено
          requestForm.classList.add('show-request');
          setTimeout(() => {
            requestForm.classList.remove('show-request');
          }, 3000);
          setTimeout(() => {
            form.reset();
          }, 1000);
        } else {
          // Если произошла ошибка
          alert("Ошибка. Сообщение не отправлено");
        } // Если не удалось связаться с php файлом

      } else {
        alert("Ошибка сервера. Номер: " + req.status);
      }
    }; // Если не удалось отправить запрос. Стоит блок на хостинге


    req.onerror = function () {
      alert("Ошибка отправки запроса");
    };

    req.send(new FormData(event.target));
  }
} //скролл по ссылкам меню и портфолио


$(document).ready(function () {
  $('.header__link, .portfolio__btn').click(function () {
    if (body.classList.contains('lock')) {
      body.classList.remove('lock');
      $('.header__burger, .header__menu').toggleClass('active');
    }

    $('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top + 'px'
    }, {
      duration: 1000,
      easing: 'swing'
    });
    return false;
  });
}); //скролл по кнопке на первом экране

$(document).ready(function () {
  $('.intro-lnk').click(function () {
    $('html, body').animate({
      scrollTop: window.innerHeight + 'px' //куда прокрутить

    }, {
      duration: 1000,
      //скорость
      easing: 'swing' //эффект

    });
    return false;
  });
}); //скролл вверх

$('body').append('<div class="upbtn">&#10148</div>');
$(window).scroll(function () {
  if ($(this).scrollTop() > 300) {
    $('.upbtn').css({
      transform: 'scale(1) rotate(-90deg)',
      opacity: 1
    });
  } else {
    $('.upbtn').css({
      transform: 'scale(0) rotate(-90deg)',
      opacity: 0
    });
  }
});
$('.upbtn').on('click', function () {
  $('html, body').animate({
    scrollTop: 0
  }, 500);
  return false;
});