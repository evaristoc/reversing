---
layout: post
title:  "A Perlin-like flow with canvas, shaders and three.js (Part 3)"
date:   2023-11-10 12:00:00 +0200
categories: blog update
---


# Putting everything together

In [part I]({{site.baseurl}}{% link _posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01.markdown %}) and [part II]({{site.baseurl}}{% link _posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02.markdown %}) we discussed some of the graphic tools that Darryl Huffman used to create his "Perlin Flow Field" on CodePen.

Darryl utilized the 2D graphics canvas API, Three.js (the 3D graphics library), and GLSL shaders. They way all those graphic tools were made to work together was something that piqued my curiosity. In an attemp to determine how Darryl obtained that result, I made some basic reverse engineering.

As a reminder, this is again a link to Darryl's work:

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="vwmYgz" data-user="darrylhuffman" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/darrylhuffman/pen/vwmYgz">
  Perlin Flow Field</a> by Darryl Huffman (<a href="https://codepen.io/darrylhuffman">@darrylhuffman</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<br/>
<br/>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>



In this third and last post we will check how Darryl brought together the canvas figure and the noise function.

# The Adapter

We have the canvas strokes and the noise function. Now what?

What Darryl wanted from his project was the strokes to move in angles based on matrix data coming from the noise function, the matrix data representing the color of the pixels resulting from the outputs of the noise function at each time interval.

Darryl wanted that data to be used as parameter for a function that gave the illusion of a wave movement of the strokes. In other words, re-render the colored pixels representing the strokes so they gave the illusion of moving like a wave, by re-drawing them at angular gradients not lower than 0 degrees and not more than 90 degrees.

And which functions are typical to waves and angles? Indeed - sines and cosines.

Extracting data directly from the openGL API is not believed to be an easy task. But the WebGL API is very powerful and comes with very useful methods. The canvas API and the WebGL API are strongly related: the WebGL API uses the canvas API for rendering. Therefore, it is possible to render in the form of an openGL and still use the canvas API methods to get two-dimensional information about the openGL rendering.

Why did Darryl use another canvas then?

# The Code

In the previous post we separated Darryl's code into three sections:

- The "context" canvas and the Hair class
- The WebGL (Three.js), the *shader*, and the texture canvas
- The interaction between the texture (aka Garryl's "perlinCanvas") and the "context" canvas.

Our focus is the second one.

**THE WEBGL, THE SHADER  AND THE TEXTURE CANVAS**  

With his project, Garryl wanted to animate "hairs" located in a circle of radio "r" in the middle of the viewport. Those hairs were canvas' strokes. They all should move based on a noise function which a pattern that changes over time in a rather regular trend. Because the way it changes the noise function is usually referred as a ***flow***, simulating the usual patterns in the movements of substances in either liquid or gas states.

So, the "liquid" pattern should lead the movement of the hairs.

Yes, but... how?

There are several ways to implement this noise function over the hairs of the "context" canvas. One way is to write the code of the noise function directly in javascript and pass its generated values into the canvas API.

Now, we know that the shader function affects the pixels of the rendered image. If we want to capture the flow effect of the noise function, we need to come up with an idea of how to get the values associated with those pixels at any point in time.

However, the noise function was written for the WebGL API, not the canvas API. There is not simple way to extract values from a WebGL shader into a javascript scope.

Unless that... if we could find an interface that capture those values per pixel affected by the noise function in the WebGL scope and bring them to the javascript scope into our "context" canvas, we could translate those values into a movement function...

Well here a popular trick: a usual method consists in extracting values from the WebGL that also relies on the canvas API and that are revealed in this example:
* With Three.js you can render a WebGL shape over which to run the shader. Three.js is actually WebGL in simpler javascript. It is like the jQuery of WebGL.
* Then you can use a canvas as a "texture" to "cover" that shape.
* The canvas texture is then a subject of the changes of the shader. Those changes are in fact numeric values  and those changes translate into values that you can extract from that texture canvas into the Javascript scope.

Garryl Huffman selected the approach of using an interface.

That canvas that acts as texture of the WebGL scope becomes and interface between the WebGL and the javascript. Although not strictly so, this approach is very close to an [Adapter design pattern](https://refactoring.guru/design-patterns/adapter).

With his project, Garryl wanted to move the  used not one but two canvas elements. They were strongly interlinked - we will explain that better later on.

Both of the canvases were made invisible to the observer.

The first canvas, the "context", contained the line strokes that would be subjected to the animation.

Let's see its functionality.


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

