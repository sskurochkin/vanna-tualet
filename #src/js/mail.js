//send mail
let requestForm = document.querySelector('.request-form');
const PHONE_EMPTY = '+375(__)-___-__-__';
const PHONE_PATTERN = /^\+375\((25|29|33|44)\)-\d{3}-\d{2}-\d{2}$/;

function phoneDigits(raw) {
    let digits = String(raw).replace(/\D/g, '');

    if (digits.indexOf('375') === 0) {
        digits = digits.slice(3);
    } else if (digits.indexOf('80') === 0 && digits.length > 9) {
        digits = digits.slice(2);
    }

    return digits.slice(0, 9);
}

function formatBelarusPhone(raw) {
    let digits = phoneDigits(raw);
    let formatted = PHONE_EMPTY.split('');
    let slot = 0;

    for (let index = 0; index < formatted.length && slot < digits.length; index++) {
        if (formatted[index] === '_') {
            formatted[index] = digits.charAt(slot);
            slot++;
        }
    }

    return formatted.join('');
}

function phoneCaret(value) {
    let blank = value.indexOf('_');
    return blank === -1 ? value.length : blank;
}

function phoneSlotsBefore(position) {
    let count = 0;
    let limit = Math.min(position, PHONE_EMPTY.length);

    for (let index = 0; index < limit; index++) {
        if (PHONE_EMPTY.charAt(index) === '_') {
            count++;
        }
    }

    return count;
}

function phoneEntryIsWrong(digits) {
    if (!digits) {
        return false;
    }

    let operators = ['25', '29', '33', '44'];

    if (digits.length === 1) {
        return operators.every(function (code) {
            return code.charAt(0) !== digits.charAt(0);
        });
    }

    return operators.indexOf(digits.slice(0, 2)) === -1;
}

function syncPhoneError(input, digits) {
    if (phoneEntryIsWrong(digits)) {
        input.classList.add('_error');
        showPhoneError(input);
    } else {
        input.classList.remove('_error');
        hidePhoneError(input);
    }
}

function renderPhone(input, digits) {
    input.dataset.digits = digits;
    input.value = formatBelarusPhone(digits);
    let caret = phoneCaret(input.value);
    input.setSelectionRange(caret, caret);
    syncPhoneError(input, digits);
}

function erasePhoneDigits(input, direction) {
    let digits = phoneDigits(input.value);
    let start = input.selectionStart;
    let end = input.selectionEnd;
    let from = phoneSlotsBefore(start);
    let to = phoneSlotsBefore(end);

    if (start !== end) {
        from = Math.min(from, digits.length);
        to = Math.min(to, digits.length);
        if (from < to) {
            renderPhone(input, digits.slice(0, from) + digits.slice(to));
        }
        return;
    }

    if (digits.length === 0) {
        return;
    }

    if (direction === 'forward') {
        if (from >= digits.length) {
            return;
        }
        renderPhone(input, digits.slice(0, from) + digits.slice(from + 1));
        return;
    }

    if (from === 0) {
        return;
    }

    let removeAt = Math.min(from, digits.length) - 1;
    renderPhone(input, digits.slice(0, removeAt) + digits.slice(removeAt + 1));
}

function phoneErrorNode(input) {
    let item = input.closest('.form__item');
    if (!item) {
        return null;
    }

    let message = item.querySelector('.form__phone-error');
    if (!message) {
        message = document.createElement('span');
        message.className = 'form__phone-error';
        message.setAttribute('role', 'alert');
        message.textContent = 'Введите корректный номер';
        item.appendChild(message);
    }

    return message;
}

function showPhoneError(input) {
    let message = phoneErrorNode(input);
    if (message) {
        message.classList.add('_visible');
    }
}

function hidePhoneError(input) {
    let item = input.closest('.form__item');
    if (!item) {
        return;
    }

    let message = item.querySelector('.form__phone-error');
    if (message) {
        message.classList.remove('_visible');
    }
}

function initPhoneMasks() {
    let phones = document.querySelectorAll('input._phone');

    for (let index = 0; index < phones.length; index++) {
        const input = phones[index];
        input.setAttribute('inputmode', 'tel');
        input.setAttribute('autocomplete', 'tel');
        phoneErrorNode(input);

        input.addEventListener('focus', function () {
            if (input.value === '') {
                input.value = PHONE_EMPTY;
            }
            window.setTimeout(function () {
                let caret = phoneCaret(input.value);
                input.setSelectionRange(caret, caret);
            }, 0);
        });

        input.addEventListener('blur', function () {
            if (phoneDigits(input.value) === '') {
                input.value = '';
            }
        });

        input.addEventListener('keydown', function (event) {
            if (event.key !== 'Backspace' && event.key !== 'Delete') {
                return;
            }

            event.preventDefault();
            erasePhoneDigits(input, event.key === 'Delete' ? 'forward' : 'backward');
        });

        input.addEventListener('input', function () {
            let nextDigits = phoneDigits(input.value);
            let prevDigits = input.dataset.digits || '';

            if (nextDigits === prevDigits && prevDigits.length > 0 && input.value.length < PHONE_EMPTY.length) {
                nextDigits = prevDigits.slice(0, -1);
            }

            renderPhone(input, nextDigits);
        });
    }
}

initPhoneMasks();

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
        if (input.classList.contains('_phone')) {
            showPhoneError(input);
        }
    }

    function formRemoveError(input) {
        input.classList.remove('_error');
        if (input.classList.contains('_phone')) {
            hidePhoneError(input);
        }
    }

    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

    function phoneTest(input) {
        return !PHONE_PATTERN.test(input.value);
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
                }
                // Если не удалось связаться с php файлом
            } else {
                alert("Ошибка сервера. Номер: " + req.status);
            }
        };

        // Если не удалось отправить запрос. Стоит блок на хостинге
        req.onerror = function () {
            alert("Ошибка отправки запроса");
        };
        req.send(new FormData(event.target));
    }
}
