---
layout: post
title:  "A Perlin-like flow with canvas, shaders and three.js"
date:   2023-10-07 12:00:00 +0200
categories: blog update
---
<link rel="stylesheet" href="{{ site.baseurl }}{% link src/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs/scrollama-setup.css %}">

# Adding Noise with Shaders is very nice!

Yeah... but let's be honest: unless you really master shaders and understand what those noise functions do, it is truly hard to get to the right effect programmatically.

Me myself I am not an expert. So what do I do...? Exactly: a bit of reverse engineering.

I was looking for a nice candidate for some reverse engineering and recalled one implementation in codepen that I really liked. It is called ["Perlin Flow Field"](https://codepen.io/darrylhuffman/pen/vwmYgz) by [Darryl Huffman](https://darrylhuffman.com/).

The pen looks like this:

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="vwmYgz" data-user="darrylhuffman" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/darrylhuffman/pen/vwmYgz">
  Perlin Flow Field</a> by Darryl Huffman (<a href="https://codepen.io/darrylhuffman">@darrylhuffman</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

For this pen Darryl used canvas (the 2D graphics API), three.js (the 3D graphics library) and GLSL shaders. I was primarily interested in that combination of all those graphic functionalities and tools, and how the noise affected the dynamics of the visualization.

So, what sort of effect was the author after by mixing all those graphics? First let's broadly talk about the noise funcion used by Garryl.

# Noisy Perlin (*Simplex*) Noise

After [Ken Perlin](https://en.wikipedia.org/wiki/Ken_Perlin) developed the noise algorithm back in 1983 the graphics industry would not be the same. The well known [Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise) has played a big role in guiding the development of real-like image textures or in the generation of virtual landscapes.

Nowadays the original Perlin noise algorithm is mostly used in demos, giving room to other algorithms such as fractal noise and simplex noise. [Simplex noise](https://en.wikipedia.org/wiki/Simplex_noise) is in fact a modification made by the same Ken Perlin over last versions of his original ("classic") Perlin noise algorithm to make it less computational-intensive while correcting for some directional artifacts.

Differently to Perlin noise, simplex noise is under patent and it is limited of use. Because of that other people have worked on alternatives. Some of those people are Ian McEwan and Stefan Gustavson. Variations of the simplex noise algorithm by those authors and other contributors could be found on a Github's repository under [Ashima Arts](https://github.com/ashima/webgl-noise). 

> Notice that the Ashima Arts repository is still available but poorly maintained since 2016. However updates to the algorithm still continues. Stefan Gustavson cloned the original repository and he is currently the main keeper, but it appears that Ian McEwan is still one of the contributors. Recent advances on the algorithm could be read on a [scientific article dated 2022](https://jcgt.org/published/0011/01/02/paper.pdf).

The noise function used in the example we are about to evaluate is very similar to the script found at this [Ashima Arts repo](https://github.com/ashima/webgl-noise/blob/master/src/noise4D.glsl) dated 2011, with its most recent update dated 2020 at the time of this writing.

One obseration: Darryl Kuffman names his pen "Perlin flow field", but the noise function is called "*simplex*" by its author, Ian McEwan.

So it appears we are dealing with a version of the simplex noise.

Because my current knowledge over noise functions this all I can add about ( :( ). Furthermore, try to explain the noise function would take long for a single post. There is a better place to find an introduction to noise functions though - [The Book of Shaders](https://thebookofshaders.com/11/).

Now let's focus on the Darryl Kuffman project a bit more.

# The Code

The example by Garryl Kuffman can be divided in three sections:

- The *shader*.
- The *canvas*.
- The three.js part. 

I won't add much about the shader as it is containing the noise function.

Let's see the canvas:

<section id='stickyoverlay'>
    <figure>
        <!--<p>0</p>-->
    </figure>
    <div class="articlepost">
        <div class='step' data-step='1'>
            <div class="explain">
            <p>This div with a gold background has a class '<strong>step</strong>' and just crossed an offset of 33% of your viewport calculated from top to down.</p>            
            </div>
        </div>
        <div class='step' data-step='2'>
            <div class="explain">
            <p>This is the second target that cross the offset. Everytime a target crosses the offset, its index is passed as value to be shown in the figure.</p>
            </div>
        </div>
        <div class='step' data-step='3'>
            <div class="explain">
            <p>The <em>index</em> is a property hold by a <em>response</em> that is passed from  <strong>scrollama</strong> into your animation handler (eg. the <strong>handleStepEnter</strong>).</p>
            </div>
        </div>
        <div class='step' data-step='4'>
            <div class="explain">
            <p>Every time that a target passes the offset, an  <strong>is-active</strong> class is assigned to it.</p>            
            </div>
        </div>
    </div>
</section>

<!--<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.4/TweenLite.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.5/plugins/ColorPropsPlugin.min.js"></script>
<script src="{{ site.baseurl }}{% link src/vendor/js/threejs/v104/three.v104.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/vendor/js/D3js/v7.8.5/d3.v7.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/vendor/js/scrollmagic/ScrollMagic.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/vendor/js/scrollama/v2.1.2/scrollama.v2.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/vendor/js/stickyfill/v2.1.0/stickyfill.v2.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs.js %}"></script>
<script src="{{ site.baseurl }}{% link src/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs/huffman-flow-field-example.js %}"></script>
<script type="module" src="{{ site.baseurl }}{% link src/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs/scrollama-setup.js %}"></script>

