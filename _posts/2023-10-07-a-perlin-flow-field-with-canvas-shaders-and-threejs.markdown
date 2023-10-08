---
layout: post
title:  "A Perlin-like flow with canvas, shaders and three.js"
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

For this pen Darryl used canvas (the 2D graphics API), three.js (the 3D graphics library) and shaders (which can be associated to the WebGL API, which is the base of three.js). I was primarily interested in that combination of all those graphic functionalities and tools, and how the noise affect the dynamic of the visualization.

So, what sort of effect was the author after by mixing all those graphics? The first thing should be to look at the noise funcion.

# Noisy Perlin (*Simplex*) Noise

After [Ken Perlin](https://en.wikipedia.org/wiki/Ken_Perlin) developed the noise algorithm back in 1983 the graphics industry would not be the same. The well known [Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise) has played a big role in guiding the development of real-like image textures or in the generation of virtual landscapes.

Nowadays the original Perlin noise algorithm is mostly used in demos, giving room to other algorithms such as fractal noise and simplex noise. [Simplex noise](https://en.wikipedia.org/wiki/Simplex_noise) is in fact a modification made by the same Ken Perlin over last versions of his original ("classic") Perlin noise algorithm to make it less computational-intensive while correcting for some directional artifacts.

Differently to Perlin noise, simplex noise is under patent and it is limited of use. Because of that other people have worked on alternatives. Some of those people are Ian McEwan and Stefan Gustavson. Variations of the simplex noise algorithm by those authors and other contributors could be found on a Github's repository under [Ashima Arts](https://github.com/ashima/webgl-noise). Advances to their work could be read on a [scientific article dated 2022](https://jcgt.org/published/0011/01/02/paper.pdf).

The one used in the example we are about to evaluate is similar to the script found at this [Ashima Arts repo](https://github.com/ashima/webgl-noise/blob/master/src/noise3Dgrad.glsl).

> A note: Darryl Kuffman names his pen "Perlin flow field", but the noise algorithm is called "simplex" by its author, Ian McEwan





