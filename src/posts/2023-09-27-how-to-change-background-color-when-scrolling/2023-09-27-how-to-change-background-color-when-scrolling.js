window.onload = (event) => {

    var a = function () {
    var controller = new ScrollMagic.Controller()
    var second = new ScrollMagic.Scene({
        triggerElement: '#second',
        duration: "100%",
    })
    .setClassToggle('body', 'red-bg')
    //.addIndicators() // remove this before publishing
    .addTo(controller);

    var third = new ScrollMagic.Scene({
        triggerElement: '#third',
        duration: "100%",
    })
    .setClassToggle('body', 'green-bg')
    //.addIndicators() // remove this before publishing
    .addTo(controller);

    var fourth = new ScrollMagic.Scene({
        triggerElement: '#fourth',
        duration: "100%",
    })
    .setClassToggle('body', 'blue-bg')
    //.addIndicators() // remove this before publishing
    .addTo(controller);

    var tada = new ScrollMagic.Scene({
        triggerElement: '#tada',
        duration: "100%",
    })
    .setClassToggle('body', 'white-bg')
    //.addIndicators() // remove this before publishing
    .addTo(controller);
    }

    a();
    };