window.addEventListener('scroll', function(e) {
    // -- lists all CSS properties in console menu in inspect (browser)
    // console.log(target.style);

    const target = document.querySelectorAll('.scroll');

    // -- Code version without for loop
    // -- (applies to one element instead of multiple)
    // let scrolled = window.pageYOffset;
    // const rate = scrolled * -1.5;
    // target.style.transform = 'translate3d(0px, '+rate+'px, 0px)';

    let index = 0, length = target.length;
    for (index; index < length; index++) {
        let pos = window.pageYOffset * target[index].dataset.rate;

        if (target[index].dataset.direction === 'vertical') {
            target[index].style.transform = 'translate3d(0px, '+pos+'px, 0px)';
        } else {
            let posX = window.pageYOffset * target[index].dataset.ratex;
            let posY = window.pageYOffset * target[index].dataset.ratey;

            target[index].style.transform = 'translate3d('+posX+'px, '+posY+'px, 0px)';
        }

    }
});