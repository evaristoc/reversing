---
layout: post
title:  "A Perlin-like flow with canvas, shaders and three.js (Part 1)"
date:   2023-10-07 12:00:00 +0200
categories: blog update
---
<link rel="stylesheet" href="{{ site.baseurl }}{% link src/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01/scrollama-setup.css %}">

# Adding Noise with Shaders is very nice!

Yeah... but let's be honest: unless you really master shaders and understand what those noise functions do, it is truly hard to programmatically get the right effect.

I am myself not an expert in the field. So what do I do...? Exactly: a bit of reverse engineering.

I was looking for a nice candidate for some reverse engineering and recalled one implementation in codepen that I really liked. It is called ["Perlin Flow Field"](https://codepen.io/darrylhuffman/pen/vwmYgz) by [Darryl Huffman](https://darrylhuffman.com/).

The pen looks like this:

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="vwmYgz" data-user="darrylhuffman" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/darrylhuffman/pen/vwmYgz">
  Perlin Flow Field</a> by Darryl Huffman (<a href="https://codepen.io/darrylhuffman">@darrylhuffman</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

For this pen Darryl used canvas (the 2D graphics API), three.js (the 3D graphics library) and GLSL shaders. I was primarily interested in that combination of all those graphic functionalities and tools, and how the noise affected the dynamics of the visualization.

So, what sort of effect was the author after by mixing all those graphics?

# Quick overview of the noise function used in the example

For this project, Garryl Huffman made use of a *noise function*, which could be quickly derived from the name of the pen. "Perlin" is in fact the surname of [Ken Perlin](https://en.wikipedia.org/wiki/Ken_Perlin), the developer of a [noise function that bears his name](https://en.wikipedia.org/wiki/Perlin_noise) and that has been very influential to the digital graphics industry since its introduction in 1983.

It is worth noting though that Garry Huffman might have used the wrong reference to name his pen. By reading the code in the pen you would notice that the noise function used by Garryl is actually authored by Ian McEwan who refers to it as a ***simplex*** *noise function*. The [simplex noise function](https://en.wikipedia.org/wiki/Simplex_noise) was an improved algorithm made by the same Ken Perlin over its classic Perlin noise. The [simplex noise function by Ian McEwan](https://github.com/ashima/webgl-noise/blob/master/src/noise4D.glsl), in collaboration with [Stefan Gustavson](https://github.com/stegu), is actually one of the several efforts to improve the Perlin's *simplex* noise function.

Now, I won't extend about the noise function here. If you are still looking for a good explanation of noise functions and a clarification of how the Perlin noise differs from the simplex noise I will strongly recommend this [excellent chapter of "The Book of Shaders"](https://thebookofshaders.com/11/). Part of the work made by Ian McEwan and Stefan Gustavson can be found at the (apparently defunt) [Ashima Arts repository](https://github.com/ashima/webgl-noise) or even in recent articles, like [this scientific article dated 2022](https://jcgt.org/published/0011/01/02/paper.pdf).

Let's go back to the Garryl Kuffman's pen...

# The Code

We can divide Garryl Kuffman's example in three sections:

- The "context" canvas and the Hair class
- The WebGL (Three.js), the *shader*, and the texture canvas
- The interaction between the texture (aka Garryl's "perlinCanvas") and the "context" canvas.

Let's follow Garryl's code for each of those sections, in that order.

**THE "context" CANVAS AND THE *Hair* CLASS**  

Garryl used not one but two canvas elements. They were strongly interlinked - we will explain that better later on.

Both of the canvases were made invisible to the observer.

The first canvas, the "context", contained the line strokes that would be subjected to the animation.

Let's see its functionality.

<section id='stickyoverlay'>
    <figure>
        <!--<p>0</p>-->
    </figure>
    <div class="articlepost">
        <div class='step' data-step='1'>
            <div class="explain">
            <p>Garryl instantiated the two canvas elements with a width and height based on the container's offset. In principle the context canvas was not visible. Here we show a context canvas in grey. He also declares the parameters of a "circle" object and declared an empty array, "hairs".</p>

<div class="language-javascript highlighter-rouge">
<div class="highlight"><pre class="highlight">
<code>	
<span class="kd">const</span> <span class="nx">canvas</span> <span class="o">=</span> <span class="nb">document</span><span class="p">.</span><span class="nx">createElement</span><span class="p">(</span><span class="dl">'</span><span class="s1">canvas</span><span class="dl">'</span><span class="p">),</span>
        <span class="nx">context</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">getContext</span><span class="p">(</span><span class="dl">'</span><span class="s1">2d</span><span class="dl">'</span><span class="p">),</span>
        <span class="nx">perlinCanvas</span> <span class="o">=</span> <span class="nb">document</span><span class="p">.</span><span class="nx">createElement</span><span class="p">(</span><span class="dl">'</span><span class="s1">canvas</span><span class="dl">'</span><span class="p">),</span>
        <span class="nx">perlinContext</span> <span class="o">=</span> <span class="nx">perlinCanvas</span><span class="p">.</span><span class="nx">getContext</span><span class="p">(</span><span class="dl">'</span><span class="s1">2d</span><span class="dl">'</span><span class="p">),</span>
        <span class="nx">width</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">width</span> <span class="o">=</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetWidth</span><span class="p">,</span>
        <span class="nx">height</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">height</span> <span class="o">=</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetHeight</span><span class="p">,</span>
        <span class="nx">circle</span> <span class="o">=</span> <span class="p">{</span>
            <span class="na">x</span><span class="p">:</span> <span class="nx">width</span> <span class="o">/</span> <span class="mi">2</span><span class="p">,</span>
            <span class="na">y</span><span class="p">:</span> <span class="nx">height</span> <span class="o">/</span> <span class="mi">2</span><span class="p">,</span>
            <span class="na">r</span><span class="p">:</span> <span class="nx">width</span> <span class="o">*</span> <span class="p">.</span><span class="mi">2</span>
        <span class="p">},</span>
        <span class="nx">hairs</span> <span class="o">=</span> <span class="p">[]</span>
        </code>
    </pre>
</div>
</div> 

            </div>
        </div>
        <div class='step' data-step='2'>
            <div class="explain">
            <p>He will eventually instantiate the "perlin" canvas and give the same dimensions as the context canvas, but it won't be appended to any HTML element yet.</p>
<div class="language-javascript highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="kd">let</span> <span class="nx">perlinImgData</span> <span class="o">=</span> <span class="kc">undefined</span>

<span class="nx">perlinCanvas</span><span class="p">.</span><span class="nx">width</span> <span class="o">=</span> <span class="nx">width</span>
<span class="nx">perlinCanvas</span><span class="p">.</span><span class="nx">height</span> <span class="o">=</span> <span class="nx">height</span>
</code></pre></div></div>
            </div>
        </div>
        <div class='step' data-step='3'>
            <div class="explain">
            <p>It is on top of the context canvas that he randomly would draw the strokes.</p>
            </div>
        </div>
        <div class='step' data-step='4'>
            <div class="explain">
            <p>Every "hair" is an instance of the <em>Hair</em> class.
            The class takes several parameters. One of them is the <strong>circle</strong> object. Darryl's Hair class gives a position to each line stroke based on randomly generated values of circular nature and transporting those values into the scope of the parameters of his previously defined <strong>circle object</strong>. The class also gives a random length to each stroke.</p>
<div class="language-javascript highlighter-rouge"><div class="highlight"><pre class="highlight"><code>
<span class="kd">class</span> <span class="nx">Hair</span> <span class="p">{</span>
    <span class="kd">constructor</span><span class="p">(){</span>
        <span class="kd">let</span> <span class="nx">r</span> <span class="o">=</span> <span class="mi">2</span> <span class="o">*</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">random</span><span class="p">(),</span>
            <span class="nx">d</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sqrt</span><span class="p">(</span><span class="nb">Math</span><span class="p">.</span><span class="nx">random</span><span class="p">())</span>

        <span class="k">this</span><span class="p">.</span><span class="nx">position</span> <span class="o">=</span> <span class="p">{</span>
            <span class="na">x</span><span class="p">:</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">floor</span><span class="p">(</span><span class="nx">circle</span><span class="p">.</span><span class="nx">x</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">cos</span><span class="p">(</span><span class="nx">r</span><span class="p">)</span> <span class="o">*</span> <span class="nx">d</span> <span class="o">*</span> <span class="nx">circle</span><span class="p">.</span><span class="nx">r</span><span class="p">),</span>
            <span class="na">y</span><span class="p">:</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">floor</span><span class="p">(</span><span class="nx">circle</span><span class="p">.</span><span class="nx">y</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sin</span><span class="p">(</span><span class="nx">r</span><span class="p">)</span> <span class="o">*</span> <span class="nx">d</span> <span class="o">*</span> <span class="nx">circle</span><span class="p">.</span><span class="nx">r</span><span class="p">)</span>
        <span class="p">}</span>
        
        <span class="k">this</span><span class="p">.</span><span class="nx">length</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">floor</span><span class="p">(</span><span class="nb">Math</span><span class="p">.</span><span class="nx">random</span><span class="p">()</span> <span class="o">*</span> <span class="mi">10</span><span class="p">)</span> <span class="o">+</span> <span class="mi">10</span>
        <span class="nx">hairs</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="k">this</span><span class="p">)</span>
    <span class="p">}</span>
    ...
</code></pre></div></div>
            </div>
        </div>
        <div class='step' data-step='5'></div>
        <div class='step' data-step='6'>
            <div class="explain">
            <p>Darryl added a method to his Hair class to draw each of the strokes. Notice that there are two elements that will come as very important later: the <strong>perlinImgData</strong> and the context (canvas) <strong>moveTo</strong> and <strong>lineTo</strong> methods.</p>
<div class="language-javascript highlighter-rouge"><div class="highlight"><pre class="highlight"><code>
    ...
    <span class="nx">draw</span><span class="p">(){</span>
            <span class="kd">let</span> <span class="p">{</span> <span class="nx">position</span><span class="p">,</span> <span class="nx">length</span> <span class="p">}</span> <span class="o">=</span> <span class="k">this</span><span class="p">,</span>
            <span class="p">{</span> <span class="nx">x</span><span class="p">,</span> <span class="nx">y</span> <span class="p">}</span> <span class="o">=</span> <span class="nx">position</span><span class="p">,</span>
            <span class="nx">i</span> <span class="o">=</span> <span class="p">(</span><span class="nx">y</span> <span class="o">*</span> <span class="nx">width</span> <span class="o">+</span> <span class="nx">x</span><span class="p">)</span> <span class="o">*</span> <span class="mi">4</span><span class="p">,</span>
            <span class="nx">d</span> <span class="o">=</span> <span class="nx">perlinImgData</span><span class="p">.</span><span class="nx">data</span><span class="p">,</span>
            <span class="nx">noise</span> <span class="o">=</span> <span class="nx">d</span><span class="p">[</span><span class="nx">i</span><span class="p">],</span>
            <span class="nx">angle</span> <span class="o">=</span> <span class="p">(</span><span class="nx">noise</span> <span class="o">/</span> <span class="mi">255</span><span class="p">)</span> <span class="o">*</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span>
        
        <span class="nx">context</span><span class="p">.</span><span class="nx">moveTo</span><span class="p">(</span><span class="nx">x</span><span class="p">,</span> <span class="nx">y</span><span class="p">)</span>
        <span class="nx">context</span><span class="p">.</span><span class="nx">lineTo</span><span class="p">(</span><span class="nx">x</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">cos</span><span class="p">(</span><span class="nx">angle</span><span class="p">)</span> <span class="o">*</span> <span class="nx">length</span><span class="p">,</span> <span class="nx">y</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sin</span><span class="p">(</span><span class="nx">angle</span><span class="p">)</span> <span class="o">*</span> <span class="nx">length</span><span class="p">)</span>
    <span class="p">}</span>
<span class="p">}</span>
</code></pre></div></div>            
            </div>
        </div>
        <div class='step' data-step='7'>
            <div class="explain">
            <p>Using a for-loop, Darryl instanted 6000 "hairs". But where did the go? Do you remember the empty array called "hairs"? You will find that Darryl made the Hair class to add each new instance to the "hairs" list at the time of the instance construction.</p>
<div class="language-javascript highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="mi">6000</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">){</span>
    <span class="k">new</span> <span class="nx">Hair</span><span class="p">()</span>
<span class="p">}</span>
</code></pre></div></div>
            </div>
        </div>
    </div>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
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
<script src="{{ site.baseurl }}{% link src/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01.js %}"></script>
<script src="{{ site.baseurl }}{% link src/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01/huffman-flow-field-setup.js %}"></script>
<script type="module" src="{{ site.baseurl }}{% link src/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01/scrollama-setup.js %}"></script>

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

