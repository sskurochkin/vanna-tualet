//скролл по ссылкам меню и портфолио
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
        return false
    });
});

//скролл по кнопке на первом экране
$(document).ready(function () {
    $('.intro-lnk').click(function () {

        $('html, body').animate({
            scrollTop: window.innerHeight + 'px'  //куда прокрутить
        },
            {
                duration: 1000,         //скорость
                easing: 'swing'         //эффект
            });
        return false
    });
});


//скролл вверх
$('body').append('<div class="upbtn">&#10148</div>');
$(window).scroll(function() {
    if ($(this).scrollTop() > 300) {
        $('.upbtn').css({
            transform: 'scale(1) rotate(-90deg)',
            opacity: 1,
        });
        } else {
        $('.upbtn').css({
            transform: 'scale(0) rotate(-90deg)',
            opacity: 0
        });
    }
});
$('.upbtn').on('click',function() {
    $('html, body').animate({
        scrollTop: 0
    }, 500);
    return false;
});
