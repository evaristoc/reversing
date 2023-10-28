---
layout: post
title:  "A Perlin-like flow with canvas, shaders and three.js (Part 2)"
date:   2023-10-28 12:00:00 +0200
categories: blog update
---
<link rel="stylesheet" href="{{ site.baseurl }}{% link src/posts/2023-10-31-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/scrollama-setup-02.css %}">

# Revealing the Noise

In a [previous post]({{site.baseurl}}{% link _posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01.markdown %}) we were revealing how Darryl Huffman worked the figure that will be affected by the animation on his "Perlin Flow Field".

As a reminder, this is again a link to Darryl's work:

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="vwmYgz" data-user="darrylhuffman" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/darrylhuffman/pen/vwmYgz">
  Perlin Flow Field</a> by Darryl Huffman (<a href="https://codepen.io/darrylhuffman">@darrylhuffman</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

In this post we will have a look at the noise function.

# Quick overview of the noise function used in the example

For this project, Garryl Huffman made use of a *noise function*, which could be quickly derived from the name of the pen. "Perlin" is in fact the surname of [Ken Perlin](https://en.wikipedia.org/wiki/Ken_Perlin), the developer of a [noise function that bears his name](https://en.wikipedia.org/wiki/Perlin_noise) and that has been very influential to the digital graphics industry since its introduction in 1983.

It is worth noting though that Garry Huffman might have used the wrong reference to name his pen. By reading the code in the pen you would notice that the noise function used by Garryl is actually authored by Ian McEwan who refers to it as a ***simplex*** *noise function*. The [simplex noise function](https://en.wikipedia.org/wiki/Simplex_noise) was an improved algorithm made by the same Ken Perlin over its classic Perlin noise. The [simplex noise function by Ian McEwan](https://github.com/ashima/webgl-noise/blob/master/src/noise4D.glsl), in collaboration with [Stefan Gustavson](https://github.com/stegu), is actually one of the several efforts to improve the Perlin's *simplex* noise function.

Now, I won't extend about the noise function here. If you are still looking for a good explanation of noise functions and a clarification of how the Perlin noise differs from the simplex noise I will strongly recommend this [excellent chapter of "The Book of Shaders"](https://thebookofshaders.com/11/). Part of the work made by Ian McEwan and Stefan Gustavson can be found at the (apparently defunt) [Ashima Arts repository](https://github.com/ashima/webgl-noise) or even in recent articles, like [this scientific article dated 2022](https://jcgt.org/published/0011/01/02/paper.pdf).

Let's go back to the Garryl Kuffman's pen...

# The Code

In the previous post we separated Darryl's code into three sections:

- The "context" canvas and the Hair class
- The WebGL (Three.js), the *shader*, and the texture canvas
- The interaction between the texture (aka Garryl's "perlinCanvas") and the "context" canvas.

Our focus is the second one.

**THE WEBGL, THE SHADER  AND THE TEXTURE CANVAS**  

As you might have noticed, Darryl's project didn't show any rendering of the simplex function. In this part we want to show you how that function looks like by rendering it, while mentioning some aspects of the code.

The shader requires the WebGL API, which is the realm of the [Three.js](https://threejs.org/) library. 

> In few words, Three.js is for WebGL what jQuery is for vanilla Javascript. It hides part of the complexity of the language.

In his pen, Darryl used a simple shape, a plane, to run the shader on.

<div id="threejs-container"></div>

<!--<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.4/TweenLite.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.5/plugins/ColorPropsPlugin.min.js"></script>
<script src="{{ site.baseurl }}{% link src/vendor/js/threejs/v104/three.v104.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/vendor/js/D3js/v7.8.5/d3.v7.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/vendor/js/scrollmagic/ScrollMagic.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/vendor/js/scrollama/v2.1.2/scrollama.v2.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/vendor/js/stickyfill/v2.1.0/stickyfill.v2.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/posts/2023-10-31-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/2023-10-31-a-perlin-flow-field-with-canvas-shaders-and-threejs-02.js %}"></script>
<script type="module" src="{{ site.baseurl }}{% link src/posts/2023-10-31-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/huffman-flow-field-setup-02.js %}"></script>

# Tada!

The last bit of code I want to show you for now is the render of the canvas elements:

```javascript
function render() {
    var now = new Date().getTime();
    currentTime = (now - startTime) / 1000
    
    context.clearRect(0,0,width,height)

    perlinContext.clearRect(0, 0, width, height)
    perlinContext.drawImage(renderer.domElement, 0, 0)
    perlinImgData = perlinContext.getImageData(0, 0, width, height)
    
    context.beginPath()
    hairs.map(hair => hair.draw())
    context.stroke()
    
    requestAnimationFrame( render );
}
render()
```

What I would like to point out is the `hairs.map(hair => hair.draw())`, which is the draw of each stroke. No less important though is what it goes with the **perlinContext** and the value assignment to the global **perlinImgData** which is parameter of the Hair's **draw method**. For the purpose of this example we left the values of the **perlinImgData** all as zero, but if you check Darryl's code and see carefully you will notice that the perlinImgData is feeding data to the draw function and therefore to the position of the hairs in the circle.

# So... What did we learn from this code?

So far, one of the things that for me was very interesting from Darryl Huffman's example was the simplicity of ideas. I won't say the code is very simple, but some of the design concepts of the exercise, like randomly distributing hairs in a circle, were very nice. The use of the class to even append the instances in a global list were kind of smart.

Apart of that, there is still much to reveal about this code. What about the noise function? And what is the role of the "perlinContext" canvas? You might ask. Before we move to the next part, I can say that using two canvas elements is a common trick - using one canvas to extract data from an application (eg. a video) and to feed that data into another canvas to affect a visualization.

 For now, happy coding!

