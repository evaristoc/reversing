---
layout: post
title:  "How to make an animation of recursive tangent circles - a code by JK"
date:   2024-08-01 12:00:00 +0200
categories: blog update
---

<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/styles/table-code-highlight.css %}">
<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/posts/2023-11-10-a-perlin-flow-field-with-canvas-shaders-and-threejs-03/scrollama-setup-03.css %}">

https://codepen.io/DonKarlssonSan/pen/jOMROaB

Some people find circles a fascinating form. They are surrounded by mathematical paradigms, like being a closed curve and still being ruled by one of the most interesting irrational numbers, Pi, which is a [transcendental number](https://en.wikipedia.org/wiki/Transcendental_number).

And if you are a fan of circles, why not having several of them, recursively?

This is what JK, or Johan Karlsson, did for one his projects in Codepen:

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="jOMROaB" data-pen-title="Recursive Circles III" data-user="DonKarlssonSan" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/DonKarlssonSan/pen/jOMROaB">
  Recursive Circles III</a> by Johan Karlsson (<a href="https://codepen.io/DonKarlssonSan">@DonKarlssonSan</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

There are many other projects about recursivity and circles, but I chose JK's one because I like his projects and the way he codes. He is usually on the search of striking patterns based on few geometric forms, all with very simple code using pure ES5 vanilla Javascript.

In this post, I will be re-versing one of his simplest projects posted on Codepen, "Recursive Circles III". He made it as a part of a series for the 2021 edition of [Genuary](https://genuary.art/), an artificial generated month to carry out a generative art project per day.

The code for this project is truly simple: A very simple css, a one-line html and a javascript of just 58 lines of prettified code, including empty lines, consisting of:

* A canvas instantiation function
* Canvas circles using the `arc` method
* Some lines of code to control for the position and rotation of the circles
* Recursive calls of the drawing function, with a clear termination
* A `draw` function

# The Code

Let's put some attention to the JS code.

JK started his code with an instantiation of the canvas:

```javascript
function drawPattern(x, y, r, angle, iteration) {
  if(iteration < 0) return;
  
  let newR = r * shrinkFactor;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  
  let r2 = r - newR;
  let x1 = Math.cos(angle) * r2 + x;
  let y1 = Math.sin(angle) * r2 + y;
  drawPattern(x1, y1, newR, angle * 1.1, iteration - 1);
  
  let x2 = Math.cos(angle + Math.PI * 2 / 3) * r2 + x;
  let y2 = Math.sin(angle + Math.PI * 2 / 3) * r2 + y;
  drawPattern(x2, y2, newR, angle * 1.2, iteration - 1);
  
  let x3 = Math.cos(angle + Math.PI * 4 / 3) * r2 + x;
  let y3 = Math.sin(angle + Math.PI * 4 / 3) * r2 + y;
  drawPattern(x3, y3, newR, angle * 1.3, iteration - 1);

}
```
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
<code class="col01">  6
  7
  8
  9
 10
 11
<span style="color:yellow;"> 12 </span>
 13
 14
 15
 16
 17
 18
<span style="color:yellow;"> 19 </span>
 20
 21
 22
 23</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge col02">
<div class="highlight" style="margin:0px;">
<pre class="highlight col02" style="margin:0px;">
<code class="col02">
<span class="kd">let</span> <span class="nx">canvas</span><span class="p">;</span>
<span class="kd">let</span> <span class="nx">ctx</span><span class="p">;</span>
<span class="kd">let</span> <span class="nx">w</span><span class="p">,</span> <span class="nx">h</span><span class="p">;</span>
<span class="kd">let</span> <span class="nx">shrinkFactor</span><span class="p">;</span>

<span class="kd">function</span> <span class="nx">setup</span><span class="p">()</span> <span class="p">{</span>
  <span class="nx">canvas</span> <span class="o">=</span> <span class="nb">document</span><span class="p">.</span><span class="nx">querySelector</span><span class="p">(</span><span class="dl">"</span><span class="s2">#canvas</span><span class="dl">"</span><span class="p">);</span>
  <span class="nx">ctx</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">getContext</span><span class="p">(</span><span class="dl">"</span><span class="s2">2d</span><span class="dl">"</span><span class="p">);</span>
  <span class="nx">resize</span><span class="p">();</span>
  <span class="nb">window</span><span class="p">.</span><span class="nx">addEventListener</span><span class="p">(</span><span class="dl">"</span><span class="s2">resize</span><span class="dl">"</span><span class="p">,</span> <span class="nx">resize</span><span class="p">);</span>
<span class="p">}</span>

<span class="kd">function</span> <span class="nx">resize</span><span class="p">()</span> <span class="p">{</span>
  <span class="nx">w</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">width</span> <span class="o">=</span> <span class="nb">window</span><span class="p">.</span><span class="nx">innerWidth</span><span class="p">;</span>
  <span class="nx">h</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">height</span> <span class="o">=</span> <span class="nb">window</span><span class="p">.</span><span class="nx">innerHeight</span><span class="p">;</span>
<span class="p">}</span>
</code>
</pre>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>

The code above includes the declaration of some high-scope variables, the initialization of the canvas instance
and the resize function. The code doesn't have anything extraordinary: it is really standard, simple and organized.

The following is where the animation takes place:

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
<code class="col01"> 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
 35
 36
 37
 38
 39
 40
 41
 42
 43
 44
 45
 46</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge col02">
<div class="highlight" style="margin:0px;">
<pre class="highlight col02" style="margin:0px;">
<code class="col02">
<span class="kd">function</span> <span class="nx">drawPattern</span><span class="p">(</span><span class="nx">x</span><span class="p">,</span> <span class="nx">y</span><span class="p">,</span> <span class="nx">r</span><span class="p">,</span> <span class="nx">angle</span><span class="p">,</span> <span class="nx">iteration</span><span class="p">)</span> <span class="p">{</span>
  <span class="k">if</span><span class="p">(</span><span class="nx">iteration</span> <span class="o">&lt;</span> <span class="mi">0</span><span class="p">)</span> <span class="k">return</span><span class="p">;</span>
  
  <span class="kd">let</span> <span class="nx">newR</span> <span class="o">=</span> <span class="nx">r</span> <span class="o">*</span> <span class="nx">shrinkFactor</span><span class="p">;</span>
  <span class="nx">ctx</span><span class="p">.</span><span class="nx">beginPath</span><span class="p">();</span>
  <span class="nx">ctx</span><span class="p">.</span><span class="nx">arc</span><span class="p">(</span><span class="nx">x</span><span class="p">,</span> <span class="nx">y</span><span class="p">,</span> <span class="nx">r</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="mi">2</span><span class="p">);</span>
  <span class="nx">ctx</span><span class="p">.</span><span class="nx">stroke</span><span class="p">();</span>
  
  <span class="kd">let</span> <span class="nx">r2</span> <span class="o">=</span> <span class="nx">r</span> <span class="o">-</span> <span class="nx">newR</span><span class="p">;</span>
  <span class="kd">let</span> <span class="nx">x1</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">cos</span><span class="p">(</span><span class="nx">angle</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">x</span><span class="p">;</span>
  <span class="kd">let</span> <span class="nx">y1</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sin</span><span class="p">(</span><span class="nx">angle</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">y</span><span class="p">;</span>
  <span class="nx">drawPattern</span><span class="p">(</span><span class="nx">x1</span><span class="p">,</span> <span class="nx">y1</span><span class="p">,</span> <span class="nx">newR</span><span class="p">,</span> <span class="nx">angle</span> <span class="o">*</span> <span class="mf">1.1</span><span class="p">,</span> <span class="nx">iteration</span> <span class="o">-</span> <span class="mi">1</span><span class="p">);</span>
  
  <span class="kd">let</span> <span class="nx">x2</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">cos</span><span class="p">(</span><span class="nx">angle</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="mi">2</span> <span class="o">/</span> <span class="mi">3</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">x</span><span class="p">;</span>
  <span class="kd">let</span> <span class="nx">y2</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sin</span><span class="p">(</span><span class="nx">angle</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="mi">2</span> <span class="o">/</span> <span class="mi">3</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">y</span><span class="p">;</span>
  <span class="nx">drawPattern</span><span class="p">(</span><span class="nx">x2</span><span class="p">,</span> <span class="nx">y2</span><span class="p">,</span> <span class="nx">newR</span><span class="p">,</span> <span class="nx">angle</span> <span class="o">*</span> <span class="mf">1.2</span><span class="p">,</span> <span class="nx">iteration</span> <span class="o">-</span> <span class="mi">1</span><span class="p">);</span>
  
  <span class="kd">let</span> <span class="nx">x3</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">cos</span><span class="p">(</span><span class="nx">angle</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="mi">4</span> <span class="o">/</span> <span class="mi">3</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">x</span><span class="p">;</span>
  <span class="kd">let</span> <span class="nx">y3</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sin</span><span class="p">(</span><span class="nx">angle</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="mi">4</span> <span class="o">/</span> <span class="mi">3</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">y</span><span class="p">;</span>
  <span class="nx">drawPattern</span><span class="p">(</span><span class="nx">x3</span><span class="p">,</span> <span class="nx">y3</span><span class="p">,</span> <span class="nx">newR</span><span class="p">,</span> <span class="nx">angle</span> <span class="o">*</span> <span class="mf">1.3</span><span class="p">,</span> <span class="nx">iteration</span> <span class="o">-</span> <span class="mi">1</span><span class="p">);</span>

<span class="p">}</span>
</code>
</pre>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<script src="
https://cdn.jsdelivr.net/npm/mathjs@13.0.3/lib/browser/mathjs.min.js
"></script>
<script type="module" src="{{ site.baseurl }}{% link mngassets/posts/2024-08-01-how-to-make-recursive-circles-like-jk/js/main.js %}"></script>

https://www.youtube.com/watch?v=pBeHXNRPNi4

https://thinkib.net/mathanalysis/page/27758/3-circles-inside-a-circle

**Waves and Trigonometry**

Another interesting aspect of the project is the one used to create the effect of waves passing through the "hairs".

Darryl wanted the strokes to oscillate right and left based on data coming from the WebGL renderer. More specifically, variations in the coloring of the pixels of each "screenshot" should drive changes in the rotation of the stroke, giving the illusion of balancing or waving.

The canvas API offers different solutions for rotating drawings. Examples are:
- an ```arc``` method
- a ```rotate``` method

Darryl used a different approach. He calculated the angle of rotation, positioned the pen in the origin point of the stroke (```(x,y)```) and redraw the stroke using the canvas' [**lineTo**](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo) method based on the angle of rotation.

For that he needed to use some formulas. And which functions are common to waves, rotations, and angles? Indeed, [trigonometic functions](https://www.math.net/trigonometric-functions).

Darryl used one of the values of rgba-encoded colors to calculate the angles of rotation. Remember that rgb-encoded colors are represented by a vector of values ranging from 0 to 255. He needed only one of those three coordinates because in his project all the coordinates had the same value per pixel (grey-scale).


# The Code

Let's see first the use of the canvas interface and then let's explore the balancing movement of the strokes.



# Tada!

If you look closely at the last image, you might notice that the "hairs" move to the right and left based on how light or dark the the passing noise flow is.

This passing noise flow is kept away from the viewer, giving the illusion of an invisible force flowing through the hairs.

# So... What did we learn from this code?

There are few things I learned from this single project:

* the use of flowing noise functions to get effects on canvas-based graphics
* a revision of the power of the canvas API as intermediate to get data between graphical APIs
* a refreshing of rotation programming techniques
* ... and more

In fact, there are still things we can get deeper into by just using this example, but I think we could stop here.

# Final Remarks

I still find myself ripping at the Darryl's pen as I watch the moving of the hairs mimicking the passing of a soft water stream accross floating grass.

From this project I liked the way some nice effects were obtained with a minimal effort. If you consider all the tools and technology involved you might wonder what I mean with "minimal effort".

It is fair to say that only when you have at least a basic understanding of all those technologies and techniques the effort of putting them together becomes closer to "minimal". And I would not disagree. But for this project in particular is more about the few elements used between all those technologies to generate the final effect. For example, how a single value from the WebGL rendering was enough to create a nice visual effect in the context canvas. 

Now, what are your thoughts? Was there anything Darryl Huffman could have done differently? Is this pen one that could work for some of your projects? Is there any other effect that you would like to try using similar techniques?

 I hope that all three of these posts were helpful for you. With this we have completed our analysis of this implementation. Time for something new. Meanwhile, I wish you happy coding!

