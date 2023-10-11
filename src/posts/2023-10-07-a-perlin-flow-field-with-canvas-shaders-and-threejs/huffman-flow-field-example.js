let container = document.querySelector("figure");
let startTime = new Date().getTime();
let renderer;

renderer = new THREE.WebGLRenderer({ alpha: true })

function init(){
	//console.log(container);
    const baseCanvas = document.createElement('canvas'),
		 baseContext = baseCanvas.getContext('2d'),
		 perlinCanvas = document.createElement('canvas'),
		 perlinContext = perlinCanvas.getContext('2d'),
		 width = baseCanvas.width = container.offsetWidth,
		 //height = baseCanvas.height = container.offsetHeight,
		 height = baseCanvas.height = 150,
         circle = {
			 x: width / 2,
			 y: height / 2,
			 r: width * .2
		 },
		 hairs = []
	
    baseCanvas.setAttribute("id", "context");
    perlinCanvas.setAttribute("id", "perlinCanvas");
	container.appendChild(baseCanvas);
    renderer.setSize( width, height );

    let perlinImgData = undefined
	
	perlinCanvas.width = width
	perlinCanvas.height = height
	
	baseContext.strokeStyle = '#111'
    baseContext.fillStyle = "rgb(200,200,200)";
    baseContext.fillRect(0, 0, width, height);

    //returns a random integer in a range
    function random(min, max) {
        return (min + Math.random() * (max - min) + 0.5) | 0;
    }

    function update() {
        baseContext.rect(20,20,150,100);
        baseContext.fill();
      }

	class Hair {
		constructor(){
			let r = 2 * Math.PI * Math.random(),
			    d = Math.sqrt(Math.random())

			this.position = {
				x: Math.floor(circle.x + Math.cos(r) * d * circle.r),
				y: Math.floor(circle.y + Math.sin(r) * d * circle.r)
			}
			
			this.length = Math.floor(Math.random() * 10) + 10
			hairs.push(this)
		}
		
		draw(){
    			let { position, length } = this,
			    { x, y } = position,
			    i = (y * width + x) * 4,
			    d = perlinImgData.data,
			    noise = d[i],
			    angle = (noise / 255) * Math.PI
			
			baseContext.moveTo(x, y)
			baseContext.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
		}
	}
	
	
	for(var i = 0; i < 6000; i++){
		new Hair()
	}
	
	
	function render() {
		var now = new Date().getTime();
		currentTime = (now - startTime) / 1000
		
		baseContext.clearRect(0,0,width,height)

		perlinContext.clearRect(0, 0, width, height)
		perlinContext.drawImage(renderer.domElement, 0, 0)
		perlinImgData = perlinContext.getImageData(0, 0, width, height)

    	baseContext.beginPath()
		hairs.map(hair => hair.draw())
        //baseContext.fillRect(0, 0, width, height)
        function tweenToRandomColor() {
            TweenLite.to(baseContext, 1, {colorProps:{fillStyle:"rgb(" + random(0,255) + "," + random(0,255) + "," + random(0,255) + ")"}, onUpdate:update, onComplete:tweenToRandomColor});
          }
          baseContext.stroke()

        tweenToRandomColor();
		requestAnimationFrame( render );
	}
	render()
	
}

init();