/* IMPORTS */
import {result, circlesTheory} from './drawings.js';

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

        circlesTheory(canvasCreate(container.offsetWidth, 300, '#section01'))
    
    }
    
    // kick things off
    init();
}