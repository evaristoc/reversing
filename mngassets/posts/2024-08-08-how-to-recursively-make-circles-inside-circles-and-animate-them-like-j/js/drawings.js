/*

I am taking note from the interactions.js file

what I think it could be a possible solution is to take each element separated (circle, line, arc, etc)
and do the same way I think of coding routers, for example:

All circle functions go in one place
All line functions go in another place
etc etc etc

*/
let mathjs;
import {create, all} from 'https://cdn.jsdelivr.net/npm/mathjs@13.0.3/+esm';
const config = { }
mathjs = create(all, config);

import dat from 'https://cdn.jsdelivr.net/npm/dat.gui@0.7.9/+esm';


/* CIRCLE DRAWINGS */

export function canvas01(argts){
    //https://sbcode.net/threejs/dat-gui/
    //https://jasonsturges.medium.com/rapid-prototyping-with-dat-gui-3b1bf062f0a2
    
    const {section, canvas, ctx, guiElem, w, h} = argts;
    
    //console.log(new dat.GUI());
    const gui = new dat.GUI({ name: 'sectcanvas01', autoPlace: false });
    let guiParams = {
      rev: 0,
      shrinkFactor: 0.463,
      iteration: 6 
    };
    const revFolder = gui.addFolder('rev');
    revFolder.add(guiParams, 'rev', -15.5, 15.5, 0.5);
    revFolder.close();
    const iterationFolder = gui.addFolder('iteration');
    iterationFolder.add(guiParams, 'iteration', 1, 8, 1);
    iterationFolder.close();
    guiElem.append(gui.domElement);

    function drawPattern(x, y, R, anglsp, iteration) {
      if(iteration < 0) return;
      
      let r = R * guiParams.shrinkFactor;
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.stroke();
      
      let distCenters = R - r;
      let x1 = Math.cos(anglsp) * distCenters + x;
      let y1 = Math.sin(anglsp) * distCenters + y;
      drawPattern(x1, y1, r, anglsp * (1.1 + guiParams.rev), iteration - 1);
      
      let x2 = Math.cos(anglsp + Math.PI * 2 / 3) * distCenters + x;
      let y2 = Math.sin(anglsp + Math.PI * 2 / 3) * distCenters + y;
      drawPattern(x2, y2, r, distCenters * (1.2 + guiParams.rev), iteration - 1);
      
      let x3 = Math.cos(anglsp + Math.PI * 4 / 3) * distCenters + x;
      let y3 = Math.sin(anglsp + Math.PI * 4 / 3) * distCenters + y;
      drawPattern(x3, y3, r, distCenters * (1.3 + guiParams.rev), iteration - 1);
    
    }

    return function draw(now) {
      requestAnimationFrame(draw);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, w, h);
      let R = Math.min(w, h) * 0.475;
      let anglsp = now / 2000;
      drawPattern(w / 2, h / 2, R, anglsp, guiParams.iteration);
    }

};

export function canvas02(argts){
  //https://sbcode.net/threejs/dat-gui/
  //https://jasonsturges.medium.com/rapid-prototyping-with-dat-gui-3b1bf062f0a2
  
  const {section, canvas, ctx, guiElem, w, h} = argts;
  
  //console.log(new dat.GUI());
  const gui = new dat.GUI({ name: 'sectcanvas02', autoPlace: false });
  let guiParams = {
    shrinkFactor: 0.463,
    period: 2000,
    viewAdjust: 0.475
  };

  const periodFolder = gui.addFolder('period');
  periodFolder.add(guiParams, 'period', 50, 5000, 100);
  periodFolder.close();
  const viewFolder = gui.addFolder('size');
  viewFolder.add(guiParams, 'viewAdjust', .255, .755, .1);
  viewFolder.close();
  guiElem.append(gui.domElement);

  function drawPattern(x, y, R, anglsp, iteration) {
    if(iteration < 0) return;
    
    let r = R * guiParams.shrinkFactor;
    ctx.beginPath();
    ctx.arc(x, y, R, 0, Math.PI * 2);
    ctx.stroke();
    
    let distCenters = R - r;
    let x1 = Math.cos(anglsp) * distCenters + x;
    let y1 = Math.sin(anglsp) * distCenters + y;
    drawPattern(x1, y1, r, anglsp * (1.1), iteration - 1);
    
    let x2 = Math.cos(anglsp + Math.PI * 2 / 3) * distCenters + x;
    let y2 = Math.sin(anglsp + Math.PI * 2 / 3) * distCenters + y;
    drawPattern(x2, y2, r, distCenters * (1.2), iteration - 1);
    
    let x3 = Math.cos(anglsp + Math.PI * 4 / 3) * distCenters + x;
    let y3 = Math.sin(anglsp + Math.PI * 4 / 3) * distCenters + y;
    drawPattern(x3, y3, r, distCenters * (1.3), iteration - 1);
  
  }

  return function draw(now) {
    requestAnimationFrame(draw);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    let R = Math.min(w, h) * guiParams.viewAdjust;
    let anglsp = now / guiParams.period;
    drawPattern(w / 2, h / 2, R, anglsp, 6);
  }

};

