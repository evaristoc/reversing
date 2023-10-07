---
layout: post
title:  "A Perlin flow with canvas, shaders and three.js"
date:   2023-10-07 12:00:00 +0200
categories: blog update
---
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

I was primarily interested in that combination of all those graphic functionalities and tools. For this pen Darryl used canvas (the 2D graphics API), three.js (the 3D graphics library) and shaders (which can be associated to the WebGL API, which is the base of three.js).

So, what sort of effect was the author after by mixing all those graphics? The first thing should be to look at the noise funcion.

# Noisy Perlin Noise

