---
layout: post
title:  "A Perlin-like flow with canvas, shaders and three.js (Part 1)"
date:   2023-10-07 12:00:00 +0200
categories: blog update
---
<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/styles/table-code-highlight.css %}">
<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01/scrollama-setup.css %}">

While searching for a suitable example for a post at Re-Versing, I remembered one implementation in CodePen that I really liked. It is called ["Perlin Flow Field"](https://codepen.io/darrylhuffman/pen/vwmYgz) by [Darryl Huffman](https://darrylhuffman.com/).

The pen looks like this:

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="vwmYgz" data-user="darrylhuffman" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/darrylhuffman/pen/vwmYgz">
  Perlin Flow Field</a> by Darryl Huffman (<a href="https://codepen.io/darrylhuffman">@darrylhuffman</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Darryl utilized the 2D graphics canvas API, Three.js (the 3D graphics library), and GLSL shaders, to create this pen. 

The mix of all those graphic features and tools, as well as the use of the noise function to create an flow effect, piqued my curiosity. I made some reverse engineering to find out how Darryl managed to get that effect.

# The Code

The code by Garryl Kuffman can be divided into three sections:

- The "context" canvas and the Hair class
- The noise function, the *shader*, and the Three.js plane geometry
- The relationship between the texture (the "perlinCanvas") and the "context" canvas

Let's follow Garryl's code for each of those sections in that order.

**THE "context" CANVAS AND THE *Hair* CLASS**  

Garryl made use of two canvas components. They were closely connected; we will explain that better later on.

the line strokes that would be animated were on the "context" canvas. Let's examine its implementation.

<section id='stickyoverlay'>
    <figure>
        <!--<p>0</p>-->
    </figure>
    <div class="articlepost">
        <div class='step' data-step='1'>
            <div class="explain">
            <p>Garryl instantiated the two canvas's width and height based on the container's offset (in his case, the body element). The context canvas was made transparent. Here I show a canvas in grey. In addition, he declared an empty "hairs" array as well as the parameters of an object called "circle" with values corresponding to the context canvas. The context canvas was appended to the container.</p>

<div class="language-javascript highlighter-rouge col02">
<div class="highlight"><pre class="highlight col02">
<code class="col02 insert">	
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
        <span class="nb">document</span><span class="p">.</span><span class="nx">body</span><span class="p">.</span><span class="nx">appendChild</span><span class="p">(</span><span class="nx">canvas</span><span class="p">)</span>
        </code>
    </pre>
</div>
</div> 

            </div>
        </div>
        <div class='step' data-step='2'>
            <div class="explain">
            <p>The "perlin" canvas was eventually instantiated with the same dimensions as the context canvas, but it was not appended to any HTML element.</p>
<div class="language-javascript highlighter-rouge col02"><div class="highlight"><pre class="highlight col02"><code class="col02 insert"><span class="kd">let</span> <span class="nx">perlinImgData</span> <span class="o">=</span> <span class="kc">undefined</span>

<span class="nx">perlinCanvas</span><span class="p">.</span><span class="nx">width</span> <span class="o">=</span> <span class="nx">width</span>
<span class="nx">perlinCanvas</span><span class="p">.</span><span class="nx">height</span> <span class="o">=</span> <span class="nx">height</span>
</code></pre></div></div>
            </div>
        </div>
        <div class='step' data-step='3'>
            <div class="explain">
            <p>It is on top of the context canvas that Darryl would randomly draw the strokes.</p>
            </div>
        </div>
        <div class='step' data-step='4'>
            <div class="explain">
            <p>All "hair"'s were instances of the class <em>Hair</em>.
            The class constructor took several inputs. The global <strong>circle</strong> object was one of them. For each instance of Hair, the class constructor generated random values for "r" and "d" of a <a href="https://www.mathsisfun.com/geometry/unit-circle.html" target="_blank">unit circle</a>. These values where then used to calculate random positional (x,y) values enclosed within the global <strong>circle object</strong> by applying the <a href="https://unacademy.com/content/jee/study-material/mathematics/parametric-equations-of-a-circle/" target="_blank">parametric equation of the circle</a>. Addtionally, the class assigned a random length to each stroke.</p>
<div class="language-javascript highlighter-rouge col02"><div class="highlight"><pre class="highlight col02"><code class="col02 insert">
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
            <p>In Hair class, Darryl included a method to draw each of the strokes. Notice that there are two elements that will come as very important later: the <strong>perlinImgData</strong> and the canvas API <strong>moveTo</strong> and <strong>lineTo</strong> methods.</p>
<div class="language-javascript highlighter-rouge col02"><div class="highlight"><pre class="highlight col02"><code class="col02 insert">
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
            <p>With a for-loop, Darryl instanted 6000 "hairs". The destination of each new instance is not clear by just looking at the loop. By exploring the code of the class Hair you will find that Darryl made it to use the now global hairs list to register each new instance at the time of the instance construction.</p>
<div class="language-javascript highlighter-rouge col02"><div class="highlight"><pre class="highlight col02"><code class="col02 insert"><span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="mi">6000</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">){</span>
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
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/threejs/v104/three.v104.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/D3js/v7.8.5/d3.v7.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/scrollmagic/ScrollMagic.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/scrollama/v2.1.2/scrollama.v2.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/stickyfill/v2.1.0/stickyfill.v2.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01/huffman-flow-field-setup.js %}"></script>
<script type="module" src="{{ site.baseurl }}{% link mngassets/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01/scrollama-setup.js %}"></script>

# Tada!

The last bit of code I want to show you for now is the render of the canvas elements:

<div class="codetable-wrap" style="width:auto; overflow-x: auto;">
<table>
<colgroup>
<col width="5%" />
<col width="95%" />
</colgroup>
<tbody>
<tr>
<td style="padding:0px; position:sticky; left:0; opacity:0.70;">
<div class="language-javascript highlighter-rouge col01">
<div class="highlight" style="margin:0px">
<pre class="highlight col01" style="margin:0px;">
<code class="col01">63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
...
</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge col02">
<div class="highlight" style="margin:0px;">
<pre class="highlight col02" style="margin:0px;">
<code class="col02"><span class="kd">function</span> <span class="nx">render</span><span class="p">()</span> <span class="p">{</span>
    <span class="kd">var</span> <span class="nx">now</span> <span class="o">=</span> <span class="k">new</span> <span class="nb">Date</span><span class="p">().</span><span class="nx">getTime</span><span class="p">();</span>
    <span class="nx">currentTime</span> <span class="o">=</span> <span class="p">(</span><span class="nx">now</span> <span class="o">-</span> <span class="nx">startTime</span><span class="p">)</span> <span class="o">/</span> <span class="mi">1000</span>
    
    <span class="nx">context</span><span class="p">.</span><span class="nx">clearRect</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span><span class="mi">0</span><span class="p">,</span><span class="nx">width</span><span class="p">,</span><span class="nx">height</span><span class="p">)</span>

    <span class="nx">perlinContext</span><span class="p">.</span><span class="nx">clearRect</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">width</span><span class="p">,</span> <span class="nx">height</span><span class="p">)</span>
    <span class="nx">perlinContext</span><span class="p">.</span><span class="nx">drawImage</span><span class="p">(</span><span class="nx">renderer</span><span class="p">.</span><span class="nx">domElement</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="mi">0</span><span class="p">)</span>
    <span class="nx">perlinImgData</span> <span class="o">=</span> <span class="nx">perlinContext</span><span class="p">.</span><span class="nx">getImageData</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">width</span><span class="p">,</span> <span class="nx">height</span><span class="p">)</span>
    
    <span class="nx">context</span><span class="p">.</span><span class="nx">beginPath</span><span class="p">()</span>
    <span class="nx">hairs</span><span class="p">.</span><span class="nx">map</span><span class="p">(</span><span class="nx">hair</span> <span class="o">=&gt;</span> <span class="nx">hair</span><span class="p">.</span><span class="nx">draw</span><span class="p">())</span>
    <span class="nx">context</span><span class="p">.</span><span class="nx">stroke</span><span class="p">()</span>
    
    <span class="nx">requestAnimationFrame</span><span class="p">(</span> <span class="nx">render</span> <span class="p">);</span>
<span class="p">}</span>
<span class="nx">render</span><span class="p">()</span>
...
</code>
</pre>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>

One nice element of the functionality was the way Darryl drew the strokes (`hairs.map(hair => hair.draw())`). Something I also want to bring attention to is what happens with the **perlinContext** as well as the value assignment to the global **perlinImgData** in the Hair's **draw method**. For the sake of this example we left the values of the **perlinImgData** variables at zero. However, close examination of  Darryl's code makes clear that the perlinImgData is feeding data to the **draw** function and therefore affecting the position of the hairs in the circle.

# So... What did we learn from this code?

So far, one of the things that for me was very interesting from Darryl Huffman's example was the simplicity of ideas. I won't say the code is very simple, but some of the design concepts of the exercise, like randomly distributing hairs in a circle, were very nice. The use of the class to even append the instances in a global list were kind of smart.

Apart of that, there is still much to reveal about this code. What about the noise function? And what is the role of the "perlinContext" canvas? You might ask. Before we move to the next part, I can say that using two canvas elements is a common trick - using one canvas to extract data from an application (eg. a video) and to feed that data into another canvas to affect a visualization.

 For now, happy coding!

