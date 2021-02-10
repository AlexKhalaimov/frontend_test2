window.onload = () => {

    (function () {
        NiceSelect.bind(document.getElementById("categories-select"));

        const counters = document.querySelectorAll('.header-info-item__counter'),
            tabs = document.querySelectorAll('.js-tab-btn'),
            addCartBtns = document.querySelectorAll('.js-add-cart'),
            addFavBtns = document.querySelectorAll('.js-add-favorites'),
            addCompBtns = document.querySelectorAll('.js-add-comparsion'),
            compCounter = document.querySelector('.js-comparsion-counter'),
            favCounter = document.querySelector('.js-favorites-counter'),
            cartCounter = document.querySelector('.js-cart-counter'),
            inFavText = 'В избранном',
            inCompText = 'В сравнении',
            inCartText = 'В корзине';

        let formSelects = document.querySelectorAll(".filter-form__select"),
            tabsContent = document.querySelectorAll(".js-tab-content");   


        formSelects.forEach(item => {
            NiceSelect.bind(item);
        });


        counters.forEach(item => { 
            if (item.childNodes.length === 0) {  
                item.classList.add('hidden');
            }
        });

        tabs.forEach(item => {
            item.addEventListener('click', toggleTabs);
        });

        function toggleTabs(e) {
            if (!e.target.classList.contains('is-active')) {
                const id = e.target.getAttribute('data-tab'),
                    content = document.querySelector('.js-tab-content[data-content="' + id + '"]'),
                    activeTab = document.querySelector('.js-tab-btn.is-active'),
                    activeContent = document.querySelector('.js-tab-content.is-active');

                activeTab.classList.remove('is-active');
                activeContent.classList.remove('is-active');
                e.target.classList.add('is-active');
                content.classList.add('is-active');
            }
        }

        // counters

        function addCounter(counter) {

            if (!counter.innerText) {
                counter.innerText = 0;
            }
            counter.classList.remove('hidden');
            counter.innerText = 1 + parseInt(counter.innerText);
            changeText(this);
        }

        function changeText(item) {

            if (item.classList.contains('js-add-cart')) {
                item.lastElementChild.innerText = inCartText;

            }
            if (item.classList.contains('js-add-favorites')) {
                item.lastElementChild.innerText = inFavText;
            }
            if (item.classList.contains('js-add-comparsion')) {
                item.lastElementChild.innerText = inCompText;
            }
            item.setAttribute('disabled', true);
        }

        addCartBtns.forEach(item => {
            item.addEventListener('click', function (e) {
                addCounter.call(item, cartCounter);
            });
        });

        addFavBtns.forEach(item => {
            item.addEventListener('click', function (e) {
                addCounter.call(item, favCounter);
            });
        });
        addCompBtns.forEach(item => {
            item.addEventListener('click', function (e) {
                addCounter.call(item, compCounter);
            });
        });

        // popups

        const overlay = document.querySelector('.overlay'),
            body = document.body,
            popup = document.querySelector('.popup'),
            callbackBtn = document.querySelector('.js-callback-btn'),
            loginBtn = document.querySelector('.js-login-btn'),
            subscribeSubmit = document.querySelector('.js-subscribe-btn'),
            parent = document.querySelector('.popup__inner'),
            callbackTmpl = document.getElementById('callback-template').content,
            loginTmpl = document.getElementById('login-template').content,
            subscribeTmpl = document.getElementById('subscribe-template').content;

        const setTmpl = (tmpl, parentNode) => {

            removeAllChildNodes(parentNode);
            let clone = document.importNode(tmpl, true);
            parentNode.appendChild(clone);

        };

        const removeAllChildNodes = (parent) => {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        };

        function showPopup(e) {

            let popupCloseBtn = document.querySelector('.js-close-popup');

            if (e.target.closest('.js-callback-btn')) {

                setTmpl(callbackTmpl, parent);
                initPopupForms();

            } else if (e.target.closest('.js-login-btn')) {
                setTmpl(loginTmpl, parent);
                initPopupForms();
            } else if (e.target.closest('.js-subscribe-btn')) {
                setTmpl(subscribeTmpl, parent);
            }

            body.classList.add('body-fixed');
            fadeIn(overlay);
            fadeIn(popup, 'flex');



            popupCloseBtn.addEventListener('click', closePopup);
            overlay.addEventListener('click', closePopup);

            popup.addEventListener('click', function (e) {
                if (e.target.classList.contains('popup')) {
                    closePopup();
                }
            });

        }

        function initPopupForms() {
            let popupSubmit = document.querySelector('.js-popup-submit');
            const telInputs = document.querySelectorAll('.popup-form input[type="tel"]');
            const inputs = document.querySelectorAll('.popup-form .popup-form__input');

            if (telInputs) {
                initMask(telInputs);
            }
            inputs.forEach(item => {
                item.addEventListener('focus', function (e) {
                    clearErorrs(item.parentElement);
                });
            });

            popupSubmit.addEventListener('click', function (e) {
                validatePopup(e);
            });
        }

        function closePopup() {
            body.classList.remove('body-fixed');

            fadeOut(overlay);
            fadeOut(popup);
        }

        callbackBtn.addEventListener('click', showPopup);
        loginBtn.addEventListener('click', showPopup);

        


        // phone mask

        function initMask(elems) {
            for (const elem of elems) {
                new InputMask({
                    selector: elem,
                    layout: elem.dataset.mask
                });

            }
        }

        function InputMask(options) {
            this.el = this.getElement(options.selector);
            if (!this.el) return;
            this.layout = options.layout || '+38 (0__) ___-__-__';
            this.maskreg = this.getRegexp();

            this.setListeners();
        }

        InputMask.prototype.getRegexp = function () {
            var str = this.layout.replace(/_/g, '\\d')
            str = str.replace(/\(/g, '\\(')
            str = str.replace(/\)/g, '\\)')
            str = str.replace(/\+/g, '\\+')
            str = str.replace(/\s/g, '\\s')

            return str;
        }

        InputMask.prototype.mask = function (e) {
            var _this = e.target,
                matrix = this.layout,
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = _this.value.replace(/\D/g, "");

            if (def.length >= val.length) val = def;

            _this.value = matrix.replace(/./g, function (a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a
            });

            if (e.type == "blur") {
                var regexp = new RegExp(this.maskreg);
                if (!regexp.test(_this.value)) {
                  
                    addError(e.target.parentElement, erorrs.phone);
                }
            } else {
                this.setCursorPosition(_this.value.length, _this);
            }
        }

        InputMask.prototype.setCursorPosition = function (pos, elem) {
            elem.focus();
            if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
            else if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.collapse(true);
                range.moveEnd("character", pos);
                range.moveStart("character", pos);
                range.select()
            }
        }

        InputMask.prototype.setListeners = function () {
            this.el.addEventListener("input", this.mask.bind(this), false);
            this.el.addEventListener("focus", this.mask.bind(this), false);
            this.el.addEventListener("blur", this.mask.bind(this), false);
        }

        InputMask.prototype.getElement = function (selector) {
            if (selector === undefined) return false;
            if (this.isElement(selector)) return selector;
            if (typeof selector == 'string') {
                var el = document.querySelector(selector);
                if (this.isElement(el)) return el;
            }
            return false
        }

        InputMask.prototype.isElement = function (element) {
            return element instanceof Element || element instanceof HTMLDocument;
        }



        // ** FADE OUT FUNCTION **
        function fadeOut(el) {
            el.style.opacity = 1;
            (function fade() {
                if ((el.style.opacity -= .1) < 0) {
                    el.style.display = "none";
                } else {
                    requestAnimationFrame(fade);
                }
            })();
        };

        // ** FADE IN FUNCTION **
        function fadeIn(el, display) {
            el.style.opacity = 0;
            el.style.display = display || "block";
            (function fade() {
                var val = parseFloat(el.style.opacity);
                if (!((val += .1) > 1)) {
                    el.style.opacity = val;
                    requestAnimationFrame(fade);
                }
            })();
        };

        // reset forms 

        const resetBtn = document.querySelectorAll('.js-reset-form');
        
        resetBtn.forEach(item => {
            item.addEventListener('click', resetForm);
        });

        function resetForm(e) {
            const form = e.target.closest('.filter-form');
            let formInputs = form.querySelectorAll('input');
            let formSelects = form.querySelectorAll('.nice-select');

            formInputs.forEach(input => {
                input.value = '';
            });

            formSelects.forEach(select => {
                let optList = select.querySelectorAll('.list .option');

                optList.forEach(item => {
                    if (item.classList.contains('selected')) {
                        item.classList.remove('selected');
                    }
                });
                select.firstElementChild.innerText = optList[0].innerText;
            });
        }

        // form validation

        const searchSubmit = document.querySelector('.js-search-btn');
        const filterSubmit = document.querySelector('.js-filter-submit');
        const inputsAll = document.querySelectorAll('input');
        const erorrs = {
            nullLength: 'Это поле должно быть заполнено',
            minLength: 'Минимальная длина поля ',
            email: 'Введите корректный email',
            phone: 'Введите корректный телефон',
            negative: 'Некорректно заполнено поле'
        };
        
        let errorsArr = [];


        searchSubmit.addEventListener('click', validateSearch);
        subscribeSubmit.addEventListener('click', validateSubscribe);
        filterSubmit.addEventListener('click', validateNegative);

        
        inputsAll.forEach(item => {
            item.addEventListener('focus', function (e) {
                clearErorrs(e.target.parentElement);
            });
        });


        function validateSearch() {
            errorsArr = [];
            const form = searchSubmit.closest('.search-form');
            const input = form.querySelector('.search-form__input');

            checkLength(input, 3);
        }

        function validateSubscribe(e) {
            errorsArr = [];
            const form = subscribeSubmit.closest('.footer-form');
            const input = form.querySelector('.footer-form__input');

            checkLength(input, 3);
            checkEmail(input);
            if (errorsArr.length === 0) {
                showPopup(e);
            }
        }

        function validateNegative(e) {
            const form = e.target.closest('.filter-form');
            const inputs = form.querySelectorAll('.filter-form__input');
            errorsArr = [];
            inputs.forEach(item => {
                checkNumber(item);
            });
        }

        function validatePopup(e) {

            const form = e.target.closest('.popup-form');
            const formInputs = form.querySelectorAll('input');
            validateForms(formInputs);
        }

        function validateForms(inputs) {
            errorsArr = [];
            inputs.forEach(item => {

                switch (item.type) {
                    case 'tel':
                        checkLength(item, 7);

                        break;

                    case 'password':
                        checkLength(item, 7);

                        break;

                    case 'email':
                        checkLength(item, 4);
                        checkEmail(item);
                        break;

                    default:
                        break;
                }
            });

        }

        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        function addError(parent, error) {

            let span = document.createElement('span');
            span.classList.add('error-message');
            span.innerText = error;
            parent.appendChild(span);
            errorsArr.push(error);
        }

        function checkLength(item, minlength) {

            let value = item.value.trim();

            if (value.length === 0) {
                addError(item.parentElement, erorrs.nullLength);
                return;
            }
            if (minlength && value.length < minlength) {
                addError(item.parentElement, `${erorrs.minLength} ${minlength} символов`);
            }
        }

        function checkEmail(item) {
            let value = item.value.trim();
            if (value.length > 0) {
                if (!validateEmail(value)) {
                    addError(item.parentElement, erorrs.email);
                }
            }

        }

        function checkNumber(item) {
            if (item.value.replace(/\s/g, '').length === 0 || isNaN(item.value)) {
                addError(item.parentElement, erorrs.negative);
            } else if (Math.sign(item.value) < 0) {
                addError(item.parentElement, erorrs.negative);
            }
        }

        function clearErorrs(parent) {
            let errors = parent.querySelectorAll('.error-message');
            if (errors.length) {
                errors.forEach(item => {
                    parent.removeChild(item);
                });
            }
        }

        // menu toggling

        const menuOpenBtn = document.querySelector('.js-open-menu'),
            menuCloseBtn = document.querySelector('.js-close-menu'),
            menu = document.querySelector('.js-menu');


            menuOpenBtn.addEventListener('click', showMenu);
            menuCloseBtn.addEventListener('click', closeMenu);

        function showMenu () {
            body.classList.add('body-fixed');
            menu.classList.add('menu-open');
        }
        function closeMenu () {
            body.classList.remove('body-fixed');
            menu.classList.remove('menu-open');
        }

    })();

}