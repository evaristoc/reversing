/* IMPORTS */
import {canvas01, canvas02} from './drawings.js';

import {canvasCreate} from './scene.js';

window.onload = (event) => {

    ////////////////////
    /*HELPER FUNCTIONS*/
    ////////////////////

    /////////////////////////////////////////
    /*SCROLLAMA SETUP AND ELEMENT GATHERING*/
    /////////////////////////////////////////


    //////////
    /* INIT */
    //////////

    function init() {
        let container = document.querySelector('div.wrapper');

        let d01 = canvas01(canvasCreate(container.offsetWidth, 300, '#sectcanvas01'));

        let d02 = canvas02(canvasCreate(container.offsetWidth, 300, '#sectcanvas02'));

        d01(1);
        d02(1);
    
    }
    
    // kick things off
    init();
}