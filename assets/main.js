function t_throttle(fn, threshhold, scope) {
    var last;
    var deferTimer;
    threshhold || (threshhold = 250);
    return function() {
        var context = scope || this;
        var now = +new Date();
        var args = arguments;
        if (last && now < last + threshhold) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function() {
                last = now;
                fn.apply(context, args)
            }, threshhold)
        } else {
            last = now;
            fn.apply(context, args)
        }
    }
}
function t815_init(recid) {
    var rec = document.getElementById('rec' + recid);
    if (!rec)
        return;
    var menu = rec ? rec.querySelector('.t815') : null;
    if (!menu)
        return;
    var isFixed = menu.style.position === 'fixed' || window.getComputedStyle(menu).position === 'fixed';
    var isRedactorMode = menu.classList.contains('t815_redactor-mode');
    if (!isRedactorMode) {
        menu.classList.remove('t815__beforeready');
        if (isFixed && menu.getAttribute('data-bgopacity-two')) {
            t_onFuncLoad('t_menu__changeBgOpacity', function() {
                t_menu__changeBgOpacity(recid, '.t815');
                window.addEventListener('scroll', t_throttle(function() {
                    t_menu__changeBgOpacity(recid, '.t815')
                }, 200))
            })
        }
        if (isFixed && menu.getAttribute('data-appearoffset')) {
            menu.classList.remove('t815__beforeready');
            t_onFuncLoad('t_menu__showFixedMenu', function() {
                t_menu__showFixedMenu(recid, '.t815');
                window.addEventListener('scroll', t_throttle(function() {
                    t_menu__showFixedMenu(recid, '.t815')
                }, 200))
            })
        }
    }
    t_onFuncLoad('t_menu__setBGcolor', function() {
        t_menu__setBGcolor(recid, '.t815');
        window.addEventListener('resize', t_throttle(function() {
            t_menu__setBGcolor(recid, '.t815')
        }, 200))
    })
}
function t718_onSuccess(form) {
    form = form[0] ? form[0] : form;
    if (!form)
        return;
    var inputsWrapper = form.querySelector('.t-form__inputsbox');
    var paddingTopInputs = parseInt(inputsWrapper.style.paddingTop, 10) || 0;
    var paddingBottomInputs = parseInt(inputsWrapper.style.paddingBottom, 10) || 0;
    var inputsHeight = inputsWrapper.clientHeight - (paddingTopInputs + paddingBottomInputs);
    var inputsOffset = inputsWrapper.getBoundingClientRect().top + window.pageYOffset;
    var inputsBottom = inputsHeight + inputsOffset;
    var targetOffset = form.querySelector('.t-form__successbox').getBoundingClientRect().top + window.pageYOffset;
    var target = null;
    if (window.innerWidth > 960) {
        target = targetOffset - 200
    } else {
        target = targetOffset - 100
    }
    var documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
    if (targetOffset > window.pageYOffset || documentHeight - inputsBottom < window.innerHeight - 100) {
        inputsWrapper.classList.add('t718__inputsbox_hidden');
        var body = document.body;
        var paddingTopBody = parseInt(body.style.paddingTop, 10) || 0;
        var paddingBottomBody = parseInt(body.style.paddingBottom, 10) || 0;
        var bodyHeight = body.clientHeight - (paddingTopBody + paddingBottomBody);
        setTimeout(function() {
            if (window.innerHeight > bodyHeight) {
                setTimeout(function() {
                    var tildaLabel = document.querySelector('.t-tildalabel');
                    if (!tildaLabel)
                        return;
                    t718__fadeOut(tildaLabel)
                }, 50)
            }
        }, 300)
    } else {
        t718_scrollToTop(target);
        setTimeout(function() {
            inputsWrapper.classList.add('t718__inputsbox_hidden')
        }, 400)
    }
    var successUrl = form.getAttribute('data-success-url');
    if (successUrl) {
        setTimeout(function() {
            window.location.href = successUrl
        }, 500)
    }
}
function t718_scrollToTop(target) {
    if (target === window.pageYOffset) {
        return !1
    }
    var duration = 400;
    var difference = window.pageYOffset;
    var cashedDiff = window.pageYOffset;
    var step = (Math.abs(window.pageYOffset - target) * 10) / duration;
    var scrollInterval = setInterval(function() {
        if (cashedDiff > target) {
            difference -= step
        } else {
            difference += step
        }
        window.scrollTo(0, difference);
        document.body.setAttribute('data-scrollable', 'true');
        if (cashedDiff > target && window.pageYOffset <= target) {
            document.body.removeAttribute('data-scrollable');
            clearInterval(scrollInterval)
        } else if (cashedDiff <= target && window.pageYOffset >= target) {
            document.body.removeAttribute('data-scrollable');
            window.scrollTo(0, target);
            clearInterval(scrollInterval)
        }
    }, 10);
    var scrollTimeout = setTimeout(function() {
        clearInterval(scrollInterval);
        document.body.removeAttribute('data-scrollable');
        clearTimeout(scrollTimeout)
    }, duration * 2)
}
function t718__fadeOut(element) {
    if (element.style.display === 'none')
        return;
    var opacity = 1;
    var timer = setInterval(function() {
        element.style.opacity = opacity;
        opacity -= 0.1;
        if (opacity <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
            element.style.opacity = null
        }
    }, 50)
}
