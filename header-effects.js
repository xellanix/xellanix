function stickHeader() {
    const observer = new IntersectionObserver((entries) => {
        $("header").toggleClass("on-stick", !entries[0].isIntersecting);
    });

    observer.observe($("#header-stick-watcher")[0]);
}
stickHeader();

$('nav').ready(function(e) {
    $('nav').empty();

    // Maximum item can be shown currently only 5
    $('main > section[data-insert-to-navbar-menu]').each(function() {
        const id = substringTo($(this).attr('id'), '-section');
        const itemName = toCapitalizeEachWord(id, '-');
    
        $('nav').append(`<div class="nav-item-wrapper ${id}-section-class"><a href="#${id}-section">${itemName}</a></div>`);
    });
});

function changeSelectedNavItem() {
    function getLastVisibleSection() {
        let lastVisibleSection = null;
        let lastVisibleSectionTop = 0;

        $("main > section[data-insert-to-navbar-menu]").each(function() {
            const section = this;

            const rect = section.getBoundingClientRect();
            const isVisible = (rect.top >= 0 && rect.bottom <= window.innerHeight);
            
            if (isVisible && (rect.top >= lastVisibleSectionTop || lastVisibleSection === null)) {
                lastVisibleSectionTop = rect.top;
                lastVisibleSection = section;
            }
        });

        return lastVisibleSection;
    }

    function setStyleToNavBarItem() {
        const lastVisibleSection = getLastVisibleSection();
        
        if (lastVisibleSection) {
            const id = lastVisibleSection.getAttribute('id');
            $(`.nav-item-wrapper`).removeClass('active');
            $(`.nav-item-wrapper.${id}-class`).addClass('active');
        }
    }

    $(window).ready(setStyleToNavBarItem);
    $(window).on('scroll', setStyleToNavBarItem);
}
changeSelectedNavItem();

$('#hamburger-button-lottie').on('click', function() {
    $('header').toggleClass('hambar-opened');
    $('body').toggleClass('no-scroll');
});

$('.nav-item-wrapper > a').on('click', function() {
    //$("#hamburger-button-lottie").trigger("click");
    if ($('#navigation-small-hamburger').css('display') !== 'none') {
        $('#hamburger-button-lottie #animation').click();
    }
});
