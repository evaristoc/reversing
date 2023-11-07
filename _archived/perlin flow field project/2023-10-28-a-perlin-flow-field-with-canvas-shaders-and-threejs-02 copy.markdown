---
layout: post
title:  "A Perlin-like flow with canvas, shaders and three.js (Part 2)"
date:   2023-10-28 12:00:00 +0200
categories: blog update
---
<link rel="stylesheet" href="{{ site.baseurl }}{% link src/posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/huffman-flow-field-setup-02.css %}">
<style>
    .codetable-wrap::-webkit-scrollbar {
        display: none;
    }
    .codetable-wrap {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
</style>

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

# The Code (the ```noiseCanvas``` function)

In the previous post we separated Darryl's code into three sections:

- The "context" canvas and the Hair class
- The noise function, the *shader* and the Three.js plane geometry
- The interaction between the texture (aka Garryl's "perlinCanvas") and the "context" canvas.

Our focus is the second one. In the Darryl's pen all the functionalities for the rendering of the GLSL features were enclosed in the **noiseCanvas** function.

**THE NOISE FUNCTION**

For this project, Garryl Huffman made use of a *noise function*, which could be quickly derived from the name of the pen. "Perlin" is in fact the surname of [Ken Perlin](https://en.wikipedia.org/wiki/Ken_Perlin), the developer of a [noise function that bears his name](https://en.wikipedia.org/wiki/Perlin_noise) and that has been very influential to the digital graphics industry since its introduction in 1983.

It is worth noting though that Garry Huffman might have used the wrong reference to name his pen. By reading the code in the pen you would notice that the noise function used by Garryl is actually authored by Ian McEwan who refers to it as a ***simplex*** noise function. The [simplex noise function](https://en.wikipedia.org/wiki/Simplex_noise) was an improved algorithm made by the same Ken Perlin over its classic Perlin noise. The [simplex noise function by Ian McEwan](https://github.com/ashima/webgl-noise/blob/master/src/noise4D.glsl), in collaboration with [Stefan Gustavson](https://github.com/stegu), is actually one of the several efforts to improve the Perlin's *simplex* noise function.

Now, I won't extend about the noise function here. If you are still looking for a good explanation of noise functions and a clarification of how the Perlin noise differs from the simplex noise I will strongly recommend this [excellent chapter of "The Book of Shaders"](https://thebookofshaders.com/11/). Part of the work made by Ian McEwan and Stefan Gustavson can be found at the (apparently defunt) [Ashima Arts repository](https://github.com/ashima/webgl-noise) or even in recent articles, like [this scientific article dated 2022](https://jcgt.org/published/0011/01/02/paper.pdf).

The noise function is written in [GLSL](https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)), which is the default C-style language used to communicate with the openGL graphics API, which is the one associated with the WebGL API. In the Darryl's pen the GLSL script of the noise function is given as a string in the Javascript code:

```javascript
 83 function noiseCanvas() { 
 84 	let Noise3D = `
 85 //
 86 // Description : Array and textureless GLSL 2D/3D/4D simplex 
 87 //               noise functions.
 88 //      Author : Ian McEwan, Ashima Arts.
 89 //  Maintainer : stegu
 90 //     Lastmod : 20110822 (ijm)
 91 //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
 92 //               Distributed under the MIT License. See LICENSE file.
 93 //               https://github.com/ashima/webgl-noise
 94 //               https://github.com/stegu/webgl-noise
 95 // 
 96 
 97 vec3 mod289(vec3 x) {
 98 return x - floor(x * (1.0 / 289.0)) * 289.0;
 99 }
100 
101 vec4 mod289(vec4 x) {
102 return x - floor(x * (1.0 / 289.0)) * 289.0;
103 }
104 
105 vec4 permute(vec4 x) {
106 return mod289(((x*34.0)+1.0)*x);
107 }
108 
109 vec4 taylorInvSqrt(vec4 r)
110 {
111 return 1.79284291400159 - 0.85373472095314 * r;
112 }
113 
114 float snoise(vec3 v)
115 { 
116 const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
117 const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
118 
119 // First corner
120 vec3 i  = floor(v + dot(v, C.yyy) );
121 vec3 x0 =   v - i + dot(i, C.xxx) ;
122 
123 // Other corners
124 vec3 g = step(x0.yzx, x0.xyz);
125 vec3 l = 1.0 - g;
126 vec3 i1 = min( g.xyz, l.zxy );
127 vec3 i2 = max( g.xyz, l.zxy );
128 
129 //   x0 = x0 - 0.0 + 0.0 * C.xxx;
130 //   x1 = x0 - i1  + 1.0 * C.xxx;
131 //   x2 = x0 - i2  + 2.0 * C.xxx;
132 //   x3 = x0 - 1.0 + 3.0 * C.xxx;
133 vec3 x1 = x0 - i1 + C.xxx;
134 vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
135 vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
136 
137 // Permutations
138 i = mod289(i); 
139 vec4 p = permute( permute( permute( 
140 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
141 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
142 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
143 
144 // Gradients: 7x7 points over a square, mapped onto an octahedron.
145 // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
146 float n_ = 0.142857142857; // 1.0/7.0
147 vec3  ns = n_ * D.wyz - D.xzx;
148 
149 vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
150 
151 vec4 x_ = floor(j * ns.z);
152 vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
153 
154 vec4 x = x_ *ns.x + ns.yyyy;
155 vec4 y = y_ *ns.x + ns.yyyy;
156 vec4 h = 1.0 - abs(x) - abs(y);
157 
158 vec4 b0 = vec4( x.xy, y.xy );
159 vec4 b1 = vec4( x.zw, y.zw );
160 
161 //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
162 //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
163 vec4 s0 = floor(b0)*2.0 + 1.0;
164 vec4 s1 = floor(b1)*2.0 + 1.0;
165 vec4 sh = -step(h, vec4(0.0));
166 
167 vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
168 vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
169 
170 vec3 p0 = vec3(a0.xy,h.x);
171 vec3 p1 = vec3(a0.zw,h.y);
172 vec3 p2 = vec3(a1.xy,h.z);
173 vec3 p3 = vec3(a1.zw,h.w);
174 
175 //Normalise gradients
176 vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
177 p0 *= norm.x;
178 p1 *= norm.y;
179 p2 *= norm.z;
180 p3 *= norm.w;
181 
182 // Mix final noise value
183 vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
184 m = m * m;
185 return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
186 dot(p2,x2), dot(p3,x3) ) );
187 }
188 `
189 

 85 //
 86 // Description : Array and textureless GLSL 2D/3D/4D simplex 
 87 //               noise functions.
 88 //      Author : Ian McEwan, Ashima Arts.
 89 //  Maintainer : stegu
 90 //     Lastmod : 20110822 (ijm)
 91 //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
 92 //               Distributed under the MIT License. See LICENSE file.
 93 //               https://github.com/ashima/webgl-noise
 94 //               https://github.com/stegu/webgl-noise
 95 // 
 96 
 97 vec3 mod289(vec3 x) {
 98 return x - floor(x * (1.0 / 289.0)) * 289.0;
 99 }
100 
101 vec4 mod289(vec4 x) {
102 return x - floor(x * (1.0 / 289.0)) * 289.0;
103 }
104 
105 vec4 permute(vec4 x) {
106 return mod289(((x*34.0)+1.0)*x);
107 }
108 
109 vec4 taylorInvSqrt(vec4 r)
110 {
111 return 1.79284291400159 - 0.85373472095314 * r;
112 }
113 
114 float snoise(vec3 v)
115 { 
116 const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
117 const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
118 
119 // First corner
120 vec3 i  = floor(v + dot(v, C.yyy) );
121 vec3 x0 =   v - i + dot(i, C.xxx) ;
122 
123 // Other corners
124 vec3 g = step(x0.yzx, x0.xyz);
125 vec3 l = 1.0 - g;
126 vec3 i1 = min( g.xyz, l.zxy );
127 vec3 i2 = max( g.xyz, l.zxy );
128 
129 //   x0 = x0 - 0.0 + 0.0 * C.xxx;
130 //   x1 = x0 - i1  + 1.0 * C.xxx;
131 //   x2 = x0 - i2  + 2.0 * C.xxx;
132 //   x3 = x0 - 1.0 + 3.0 * C.xxx;
133 vec3 x1 = x0 - i1 + C.xxx;
134 vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
135 vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
136 
137 // Permutations
138 i = mod289(i); 
139 vec4 p = permute( permute( permute( 
140 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
141 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
142 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
143 
144 // Gradients: 7x7 points over a square, mapped onto an octahedron.
145 // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
146 float n_ = 0.142857142857; // 1.0/7.0
147 vec3  ns = n_ * D.wyz - D.xzx;
148 
149 vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
150 
151 vec4 x_ = floor(j * ns.z);
152 vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
153 
154 vec4 x = x_ *ns.x + ns.yyyy;
155 vec4 y = y_ *ns.x + ns.yyyy;
156 vec4 h = 1.0 - abs(x) - abs(y);
157 
158 vec4 b0 = vec4( x.xy, y.xy );
159 vec4 b1 = vec4( x.zw, y.zw );
160 
161 //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
162 //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
163 vec4 s0 = floor(b0)*2.0 + 1.0;
164 vec4 s1 = floor(b1)*2.0 + 1.0;
165 vec4 sh = -step(h, vec4(0.0));
166 
167 vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
168 vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
169 
170 vec3 p0 = vec3(a0.xy,h.x);
171 vec3 p1 = vec3(a0.zw,h.y);
172 vec3 p2 = vec3(a1.xy,h.z);
173 vec3 p3 = vec3(a1.zw,h.w);
174 
175 //Normalise gradients
176 vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
177 p0 *= norm.x;
178 p1 *= norm.y;
179 p2 *= norm.z;
180 p3 *= norm.w;
181 
182 // Mix final noise value
183 vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
184 m = m * m;
185 return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
186 dot(p2,x2), dot(p3,x3) ) );
187 }

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
<div class="language-javascript highlighter-rouge">
<div class="highlight" style="margin:0px">
<pre class="highlight" style="margin:0px;">
<code>
  1
  2
  3
  4
  5
  6
  7
  8
  9
 10
 11
 12
 13
 14
 15
 16
 17
 18
 19
 20
 21
 22
 23
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
 46
 47
 48
 49
 50
 51
 52
 53
 54
 55
 56
 57
 58
 59
 60
 61
 62
 63
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
 80
 81
 82
 83
 84
 85
 86
 87
 88
 89
 90
 91
 92
 93
 94
 95
 96
 97
 98
 99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
177
178
179
180
181
182
183
184
185
186
187
188
189
190
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
207
208
209
210
211
212
213
214
215
216
217
218
219
220
221
222
223
224
225
226
227
228
229
230
231
232
233
234
235
236
237
238
239
240
241
242
243
244
245
246
247
248
249
250
251
252
253
254
255
256
257
258
259
260
261
262
263
264
265
266
267
268
269
270
271
272
273
274
275
</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge">
<div class="highlight" style="margin:0px;">
<pre class="highlight" style="margin:0px;">
<code>
<span class="nx">console</span><span class="p">.</span><span class="nx">clear</span><span class="p">()</span>

<span class="kd">let</span> <span class="nx">container</span> <span class="o">=</span> <span class="nb">document</span><span class="p">.</span><span class="nx">body</span><span class="p">,</span>
    <span class="nx">startTime</span> <span class="o">=</span> <span class="k">new</span> <span class="nb">Date</span><span class="p">().</span><span class="nx">getTime</span><span class="p">(),</span>
    <span class="nx">renderer</span>

<span class="kd">function</span> <span class="nx">init</span><span class="p">(){</span>
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
	
	<span class="kd">let</span> <span class="nx">perlinImgData</span> <span class="o">=</span> <span class="kc">undefined</span>
	
	<span class="nx">perlinCanvas</span><span class="p">.</span><span class="nx">width</span> <span class="o">=</span> <span class="nx">width</span>
	<span class="nx">perlinCanvas</span><span class="p">.</span><span class="nx">height</span> <span class="o">=</span> <span class="nx">height</span>
	
	<span class="nx">context</span><span class="p">.</span><span class="nx">strokeStyle</span> <span class="o">=</span> <span class="dl">'</span><span class="s1">#111</span><span class="dl">'</span>
	
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
	
	
	<span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="mi">6000</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">){</span>
		<span class="k">new</span> <span class="nx">Hair</span><span class="p">()</span>
	<span class="p">}</span>
	
	
	<span class="kd">function</span> <span class="nx">render</span><span class="p">()</span> <span class="p">{</span>
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
	
<span class="p">}</span>

<span class="kd">function</span> <span class="nx">noiseCanvas</span><span class="p">()</span> <span class="p">{</span> 
	<span class="kd">let</span> <span class="nx">Noise3D</span> <span class="o">=</span> <span class="s2">`
//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
// 

vec3 mod289(vec3 x) {
return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
{ 
const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
vec3 i  = floor(v + dot(v, C.yyy) );
vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
vec3 g = step(x0.yzx, x0.xyz);
vec3 l = 1.0 - g;
vec3 i1 = min( g.xyz, l.zxy );
vec3 i2 = max( g.xyz, l.zxy );

//   x0 = x0 - 0.0 + 0.0 * C.xxx;
//   x1 = x0 - i1  + 1.0 * C.xxx;
//   x2 = x0 - i2  + 2.0 * C.xxx;
//   x3 = x0 - 1.0 + 3.0 * C.xxx;
vec3 x1 = x0 - i1 + C.xxx;
vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
i = mod289(i); 
vec4 p = permute( permute( permute( 
i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
+ i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
+ i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
float n_ = 0.142857142857; // 1.0/7.0
vec3  ns = n_ * D.wyz - D.xzx;

vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

vec4 x_ = floor(j * ns.z);
vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

vec4 x = x_ *ns.x + ns.yyyy;
vec4 y = y_ *ns.x + ns.yyyy;
vec4 h = 1.0 - abs(x) - abs(y);

vec4 b0 = vec4( x.xy, y.xy );
vec4 b1 = vec4( x.zw, y.zw );

//vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
//vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
vec4 s0 = floor(b0)*2.0 + 1.0;
vec4 s1 = floor(b1)*2.0 + 1.0;
vec4 sh = -step(h, vec4(0.0));

vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

vec3 p0 = vec3(a0.xy,h.x);
vec3 p1 = vec3(a0.zw,h.y);
vec3 p2 = vec3(a1.xy,h.z);
vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
p0 *= norm.x;
p1 *= norm.y;
p2 *= norm.z;
p3 *= norm.w;

// Mix final noise value
vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
m = m * m;
return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
dot(p2,x2), dot(p3,x3) ) );
}
`</span>

	<span class="kd">const</span> <span class="nx">shaders</span> <span class="o">=</span> <span class="p">{</span>
		<span class="na">fragment</span><span class="p">:</span> <span class="s2">`

uniform vec2 resolution;
uniform float time;

</span><span class="p">${</span><span class="nx">Noise3D</span><span class="p">}</span><span class="s2">

void main() {
float speed = 16.;
float scale = 3.5;

vec2 st = gl_FragCoord.xy/resolution.xy;
st.x *= resolution.x/resolution.y;
st *= scale;

float noise = snoise(vec3(st.x, st.y, time * speed * 0.01));
float c = (noise + 1.) / 2.;

gl_FragColor = vec4(c, c, c, 1.);
}

`</span><span class="p">,</span>
		<span class="na">vertex</span><span class="p">:</span> <span class="s2">`

void main() {

gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`</span>
	<span class="p">}</span>


	<span class="kd">let</span> <span class="nx">width</span> <span class="o">=</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetWidth</span><span class="p">,</span>
	    <span class="nx">height</span> <span class="o">=</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetHeight</span><span class="p">,</span>
	    <span class="nx">currentTime</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span>
	    <span class="nx">timeAddition</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">random</span><span class="p">()</span> <span class="o">*</span> <span class="mi">1000</span>

	<span class="kd">const</span> <span class="nx">scene</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">THREE</span><span class="p">.</span><span class="nx">Scene</span><span class="p">(),</span>
		 <span class="nx">camera</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">THREE</span><span class="p">.</span><span class="nx">OrthographicCamera</span><span class="p">(</span> <span class="nx">width</span> <span class="o">/</span> <span class="o">-</span> <span class="mi">2</span><span class="p">,</span> <span class="nx">width</span> <span class="o">/</span> <span class="mi">2</span><span class="p">,</span> <span class="nx">height</span> <span class="o">/</span> <span class="mi">2</span><span class="p">,</span> <span class="nx">height</span> <span class="o">/</span> <span class="o">-</span> <span class="mi">2</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="mi">100</span> <span class="p">)</span>
	
	<span class="nx">renderer</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">THREE</span><span class="p">.</span><span class="nx">WebGLRenderer</span><span class="p">({</span> <span class="na">alpha</span><span class="p">:</span> <span class="kc">true</span> <span class="p">})</span>

	<span class="nx">renderer</span><span class="p">.</span><span class="nx">setSize</span><span class="p">(</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetWidth</span><span class="p">,</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetHeight</span> <span class="p">)</span>
	<span class="c1">//container.appendChild(renderer.domElement)</span>



	<span class="kd">let</span> <span class="nx">uniforms</span> <span class="o">=</span> <span class="p">{</span>
		<span class="na">time</span><span class="p">:</span> <span class="p">{</span> <span class="na">value</span><span class="p">:</span> <span class="mi">1</span> <span class="o">+</span> <span class="nx">timeAddition</span> <span class="p">},</span>
		<span class="na">resolution</span><span class="p">:</span> <span class="p">{</span> <span class="na">value</span><span class="p">:</span> <span class="k">new</span> <span class="nx">THREE</span><span class="p">.</span><span class="nx">Vector2</span><span class="p">(</span><span class="nx">container</span><span class="p">.</span><span class="nx">offsetWidth</span><span class="p">,</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetHeight</span><span class="p">)</span> <span class="p">}</span>
	<span class="p">}</span>

	<span class="kd">let</span> <span class="nx">shaderMaterial</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">THREE</span><span class="p">.</span><span class="nx">ShaderMaterial</span><span class="p">(</span> <span class="p">{</span>
		<span class="na">uniforms</span><span class="p">:</span>       <span class="nx">uniforms</span><span class="p">,</span>
		<span class="na">vertexShader</span><span class="p">:</span>   <span class="nx">shaders</span><span class="p">.</span><span class="nx">vertex</span><span class="p">,</span>
		<span class="na">fragmentShader</span><span class="p">:</span> <span class="nx">shaders</span><span class="p">.</span><span class="nx">fragment</span><span class="p">,</span>
		<span class="c1">//blending:       THREE.AdditiveBlending,</span>
		<span class="na">depthTest</span><span class="p">:</span>      <span class="kc">false</span><span class="p">,</span>
		<span class="na">transparent</span><span class="p">:</span>    <span class="kc">true</span><span class="p">,</span>
		<span class="na">vertexColors</span><span class="p">:</span>   <span class="kc">true</span>
	<span class="p">});</span>

	<span class="kd">let</span> <span class="nx">geometry</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">THREE</span><span class="p">.</span><span class="nx">PlaneGeometry</span><span class="p">(</span> <span class="nx">width</span><span class="p">,</span> <span class="nx">height</span><span class="p">,</span> <span class="mi">32</span> <span class="p">);</span>
	<span class="kd">let</span> <span class="nx">plane</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">THREE</span><span class="p">.</span><span class="nx">Mesh</span><span class="p">(</span> <span class="nx">geometry</span><span class="p">,</span> <span class="nx">shaderMaterial</span> <span class="p">);</span>
	<span class="nx">scene</span><span class="p">.</span><span class="nx">add</span><span class="p">(</span> <span class="nx">plane</span> <span class="p">);</span>
	<span class="nx">plane</span><span class="p">.</span><span class="nx">position</span><span class="p">.</span><span class="nx">z</span> <span class="o">=</span> <span class="mf">0.5</span><span class="p">;</span>


	<span class="nx">camera</span><span class="p">.</span><span class="nx">position</span><span class="p">.</span><span class="nx">y</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
	<span class="nx">camera</span><span class="p">.</span><span class="nx">position</span><span class="p">.</span><span class="nx">x</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
	<span class="nx">camera</span><span class="p">.</span><span class="nx">position</span><span class="p">.</span><span class="nx">z</span> <span class="o">=</span> <span class="mi">100</span><span class="p">;</span>

	<span class="kd">function</span> <span class="nx">render</span><span class="p">()</span> <span class="p">{</span>
		<span class="kd">var</span> <span class="nx">now</span> <span class="o">=</span> <span class="k">new</span> <span class="nb">Date</span><span class="p">().</span><span class="nx">getTime</span><span class="p">();</span>
		<span class="nx">currentTime</span> <span class="o">=</span> <span class="p">(</span><span class="nx">now</span> <span class="o">-</span> <span class="nx">startTime</span><span class="p">)</span> <span class="o">/</span> <span class="mi">1000</span><span class="p">;</span>
		<span class="nx">uniforms</span><span class="p">.</span><span class="nx">time</span><span class="p">.</span><span class="nx">value</span> <span class="o">=</span> <span class="nx">currentTime</span> <span class="o">+</span> <span class="nx">timeAddition</span><span class="p">;</span>

		<span class="nx">requestAnimationFrame</span><span class="p">(</span> <span class="nx">render</span> <span class="p">);</span>
		<span class="nx">renderer</span><span class="p">.</span><span class="nx">render</span><span class="p">(</span> <span class="nx">scene</span><span class="p">,</span> <span class="nx">camera</span> <span class="p">);</span>
	<span class="p">}</span>
	<span class="nx">render</span><span class="p">();</span>
<span class="p">}</span>

<span class="nx">noiseCanvas</span><span class="p">()</span>
<span class="nx">init</span><span class="p">()</span>
</code>
</pre>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>

```c
 85 //
 86 // Description : Array and textureless GLSL 2D/3D/4D simplex 
 87 //               noise functions.
 88 //      Author : Ian McEwan, Ashima Arts.
 89 //  Maintainer : stegu
 90 //     Lastmod : 20110822 (ijm)
 91 //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
 92 //               Distributed under the MIT License. See LICENSE file.
 93 //               https://github.com/ashima/webgl-noise
 94 //               https://github.com/stegu/webgl-noise
 95 // 
 96 
 97 vec3 mod289(vec3 x) {
 98 return x - floor(x * (1.0 / 289.0)) * 289.0;
 99 }
100 
101 vec4 mod289(vec4 x) {
102 return x - floor(x * (1.0 / 289.0)) * 289.0;
103 }
104 
105 vec4 permute(vec4 x) {
106 return mod289(((x*34.0)+1.0)*x);
107 }
108 
109 vec4 taylorInvSqrt(vec4 r)
110 {
111 return 1.79284291400159 - 0.85373472095314 * r;
112 }
113 
114 float snoise(vec3 v)
115 { 
116 const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
117 const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
118 
119 // First corner
120 vec3 i  = floor(v + dot(v, C.yyy) );
121 vec3 x0 =   v - i + dot(i, C.xxx) ;
122 
123 // Other corners
124 vec3 g = step(x0.yzx, x0.xyz);
125 vec3 l = 1.0 - g;
126 vec3 i1 = min( g.xyz, l.zxy );
127 vec3 i2 = max( g.xyz, l.zxy );
128 
129 //   x0 = x0 - 0.0 + 0.0 * C.xxx;
130 //   x1 = x0 - i1  + 1.0 * C.xxx;
131 //   x2 = x0 - i2  + 2.0 * C.xxx;
132 //   x3 = x0 - 1.0 + 3.0 * C.xxx;
133 vec3 x1 = x0 - i1 + C.xxx;
134 vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
135 vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
136 
137 // Permutations
138 i = mod289(i); 
139 vec4 p = permute( permute( permute( 
140 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
141 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
142 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
143 
144 // Gradients: 7x7 points over a square, mapped onto an octahedron.
145 // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
146 float n_ = 0.142857142857; // 1.0/7.0
147 vec3  ns = n_ * D.wyz - D.xzx;
148 
149 vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
150 
151 vec4 x_ = floor(j * ns.z);
152 vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
153 
154 vec4 x = x_ *ns.x + ns.yyyy;
155 vec4 y = y_ *ns.x + ns.yyyy;
156 vec4 h = 1.0 - abs(x) - abs(y);
157 
158 vec4 b0 = vec4( x.xy, y.xy );
159 vec4 b1 = vec4( x.zw, y.zw );
160 
161 //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
162 //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
163 vec4 s0 = floor(b0)*2.0 + 1.0;
164 vec4 s1 = floor(b1)*2.0 + 1.0;
165 vec4 sh = -step(h, vec4(0.0));
166 
167 vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
168 vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
169 
170 vec3 p0 = vec3(a0.xy,h.x);
171 vec3 p1 = vec3(a0.zw,h.y);
172 vec3 p2 = vec3(a1.xy,h.z);
173 vec3 p3 = vec3(a1.zw,h.w);
174 
175 //Normalise gradients
176 vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
177 p0 *= norm.x;
178 p1 *= norm.y;
179 p2 *= norm.z;
180 p3 *= norm.w;
181 
182 // Mix final noise value
183 vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
184 m = m * m;
185 return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
186 dot(p2,x2), dot(p3,x3) ) );
187 }
```

```javascript
console.clear()

let container = document.body,
    startTime = new Date().getTime(),
    renderer

function init(){
	const canvas = document.createElement('canvas'),
		 context = canvas.getContext('2d'),
		 perlinCanvas = document.createElement('canvas'),
		 perlinContext = perlinCanvas.getContext('2d'),
		 width = canvas.width = container.offsetWidth,
		 height = canvas.height = container.offsetHeight,
		 circle = {
			 x: width / 2,
			 y: height / 2,
			 r: width * .2
		 },
		 hairs = []
	
	document.body.appendChild(canvas)
	
	let perlinImgData = undefined
	
	perlinCanvas.width = width
	perlinCanvas.height = height
	
	context.strokeStyle = '#111'
	
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
			
			context.moveTo(x, y)
			context.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
		}
	}
	
	
	for(var i = 0; i < 6000; i++){
		new Hair()
	}
	
	
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
	
}

function noiseCanvas() { 
	let Noise3D = `
//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
// 

vec3 mod289(vec3 x) {
return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
{ 
const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
vec3 i  = floor(v + dot(v, C.yyy) );
vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
vec3 g = step(x0.yzx, x0.xyz);
vec3 l = 1.0 - g;
vec3 i1 = min( g.xyz, l.zxy );
vec3 i2 = max( g.xyz, l.zxy );

//   x0 = x0 - 0.0 + 0.0 * C.xxx;
//   x1 = x0 - i1  + 1.0 * C.xxx;
//   x2 = x0 - i2  + 2.0 * C.xxx;
//   x3 = x0 - 1.0 + 3.0 * C.xxx;
vec3 x1 = x0 - i1 + C.xxx;
vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
i = mod289(i); 
vec4 p = permute( permute( permute( 
i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
+ i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
+ i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
float n_ = 0.142857142857; // 1.0/7.0
vec3  ns = n_ * D.wyz - D.xzx;

vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

vec4 x_ = floor(j * ns.z);
vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

vec4 x = x_ *ns.x + ns.yyyy;
vec4 y = y_ *ns.x + ns.yyyy;
vec4 h = 1.0 - abs(x) - abs(y);

vec4 b0 = vec4( x.xy, y.xy );
vec4 b1 = vec4( x.zw, y.zw );

//vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
//vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
vec4 s0 = floor(b0)*2.0 + 1.0;
vec4 s1 = floor(b1)*2.0 + 1.0;
vec4 sh = -step(h, vec4(0.0));

vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

vec3 p0 = vec3(a0.xy,h.x);
vec3 p1 = vec3(a0.zw,h.y);
vec3 p2 = vec3(a1.xy,h.z);
vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
p0 *= norm.x;
p1 *= norm.y;
p2 *= norm.z;
p3 *= norm.w;

// Mix final noise value
vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
m = m * m;
return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
dot(p2,x2), dot(p3,x3) ) );
}
`

	const shaders = {
		fragment: `

uniform vec2 resolution;
uniform float time;

${Noise3D}

void main() {
float speed = 16.;
float scale = 3.5;

vec2 st = gl_FragCoord.xy/resolution.xy;
st.x *= resolution.x/resolution.y;
st *= scale;

float noise = snoise(vec3(st.x, st.y, time * speed * 0.01));
float c = (noise + 1.) / 2.;

gl_FragColor = vec4(c, c, c, 1.);
}

`,
		vertex: `

void main() {

gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
	}


	let width = container.offsetWidth,
	    height = container.offsetHeight,
	    currentTime = 0,
	    timeAddition = Math.random() * 1000

	const scene = new THREE.Scene(),
		 camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0, 100 )
	
	renderer = new THREE.WebGLRenderer({ alpha: true })

	renderer.setSize( container.offsetWidth, container.offsetHeight )
	//container.appendChild(renderer.domElement)



	let uniforms = {
		time: { value: 1 + timeAddition },
		resolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) }
	}

	let shaderMaterial = new THREE.ShaderMaterial( {
		uniforms:       uniforms,
		vertexShader:   shaders.vertex,
		fragmentShader: shaders.fragment,
		//blending:       THREE.AdditiveBlending,
		depthTest:      false,
		transparent:    true,
		vertexColors:   true
	});

	let geometry = new THREE.PlaneGeometry( width, height, 32 );
	let plane = new THREE.Mesh( geometry, shaderMaterial );
	scene.add( plane );
	plane.position.z = 0.5;


	camera.position.y = 0;
	camera.position.x = 0;
	camera.position.z = 100;

	function render() {
		var now = new Date().getTime();
		currentTime = (now - startTime) / 1000;
		uniforms.time.value = currentTime + timeAddition;

		requestAnimationFrame( render );
		renderer.render( scene, camera );
	}
	render();
}

noiseCanvas()
init()
```

<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto; width:auto; padding:.2em .2em;"><table style="border: #202020;" ><tr style="border: #202020;"><td style="border: #202020;"><pre style="border: #202020; background: #202020; margin: 0; line-height: 95%">

   86
   87
  ...

  114
  115
  ...

  144
  145
  146
  147
  ...

  175
  176
  177
  178
  179
  180
  181
  182
  183
  184
  185
  186
  187
  ...
</pre></td><td style="border: #202020;"><pre style="border: #202020; background: #202020; margin: 0; line-height: 95%">
<span style="color: #999999; font-style: italic">//</span>
<span style="color: #999999; font-style: italic">// Description : Array and textureless GLSL 2D/3D/4D simplex </span>
<span style="color: #999999; font-style: italic">//               noise functions.</span>
...

<span style="color: #6ab825;">float</span> <span style="color: #447fcf">snoise</span><span style="color: #d0d0d0">(vec3</span> <span style="color: #d0d0d0">v)</span>
<span style="color: #d0d0d0">{</span> 
...

<span style="color: #999999; font-style: italic">// Gradients: 7x7 points over a square, mapped onto an octahedron.</span>
<span style="color: #999999; font-style: italic">// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)</span>
<span style="color: #6ab825;">float</span> <span style="color: #d0d0d0">n_</span> <span style="color: #d0d0d0">=</span> <span style="color: #3677a9">0.142857142857</span><span style="color: #d0d0d0">;</span> <span style="color: #999999; font-style: italic">// 1.0/7.0</span>
<span style="color: #6ab825;">vec3</span>  <span style="color: #d0d0d0">ns</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">n_</span> <span style="color: #d0d0d0">*</span> <span style="color: #d0d0d0">D.wyz</span> <span style="color: #d0d0d0">-</span> <span style="color: #d0d0d0">D.xzx;</span>
...

<span style="color: #999999; font-style: italic">//Normalise gradients</span>
<span style="color: #6ab825;">vec4</span> <span style="color: #d0d0d0">norm</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">taylorInvSqrt(vec4(dot(p0,p0),</span> <span style="color: #d0d0d0">dot(p1,p1),</span> <span style="color: #d0d0d0">dot(p2,</span> <span style="color: #d0d0d0">p2),</span> <span style="color: #d0d0d0">dot(p3,p3)));</span>
<span style="color: #d0d0d0">p0</span> <span style="color: #d0d0d0">*=</span> <span style="color: #d0d0d0">norm.x;</span>
<span style="color: #d0d0d0">p1</span> <span style="color: #d0d0d0">*=</span> <span style="color: #d0d0d0">norm.y;</span>
<span style="color: #d0d0d0">p2</span> <span style="color: #d0d0d0">*=</span> <span style="color: #d0d0d0">norm.z;</span>
<span style="color: #d0d0d0">p3</span> <span style="color: #d0d0d0">*=</span> <span style="color: #d0d0d0">norm.w;</span>

<span style="color: #999999; font-style: italic">// Mix final noise value</span>
<span style="color: #6ab825;">vec4</span> <span style="color: #d0d0d0">m</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">max(</span><span style="color: #3677a9">0.6</span> <span style="color: #d0d0d0">-</span> <span style="color: #d0d0d0">vec4(dot(x0,x0),</span> <span style="color: #d0d0d0">dot(x1,x1),</span> <span style="color: #d0d0d0">dot(x2,x2),</span> <span style="color: #d0d0d0">dot(x3,x3)),</span> <span style="color: #3677a9">0.0</span><span style="color: #d0d0d0">);</span>
<span style="color: #d0d0d0">m</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">m</span> <span style="color: #d0d0d0">*</span> <span style="color: #d0d0d0">m;</span>
<span style="color: #6ab825; font-weight: bold">return</span> <span style="color: #3677a9">42.0</span> <span style="color: #d0d0d0">*</span> <span style="color: #d0d0d0">dot(</span> <span style="color: #d0d0d0">m*m,</span> <span style="color: #d0d0d0">vec4(</span> <span style="color: #d0d0d0">dot(p0,x0),</span> <span style="color: #d0d0d0">dot(p1,x1),</span> 
<span style="color: #d0d0d0">dot(p2,x2),</span> <span style="color: #d0d0d0">dot(p3,x3)</span> <span style="color: #d0d0d0">)</span> <span style="color: #d0d0d0">);</span>
<span style="color: #d0d0d0">}</span>
...
</pre></td></tr></table></div>


We showed just sections of the noise function to highlight the purposed use of gradients. Those gradients are the ones that give the flow behaviour to the noise function.

**THE SHADERS**

Shaders, as you probably know, are functions in WebGL that control the pixel properties. The ***vertex shader*** controls the geometries of the scene, and the ***fragment shader*** control the coloring at each pixel. The shaders are also written in GLSL and therefore are again provided as string:


<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto; width:auto; padding:.2em .2em;"><table style="border: #202020;" ><tr style="border: #202020;"><td style="border: #202020;"><pre style="border: #202020; background: #202020; margin: 0; line-height: 103%; overflow: hidden;">189
190
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
207
208
209
210
211
212
213
214
215
216
217
218
219
220</pre></td><td style="border: #202020; line-height: 95%; "><pre style="border: #202020; background: #202020; margin: 0; padding:0px; overflow: hidden;">

<span style="color: #66d9ef">const</span> <span style="color: #a6e22e">shaders</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">{</span>
      <span style="color: #a6e22e">fragment</span><span style="color: #f92672">:</span> <span style="color: #960050; background-color: #1e0010">`</span>
   </pre>
<pre style="border: #202020; background: #202020; background-color: #1e0010; margin: 0; padding: 0px; overflow: hidden;">
            <span style="color: #6ab825; font-weight: bold">uniform</span> <span style="color: #6ab825">vec2</span> <span style="color: #d0d0d0">resolution;</span>
            <span style="color: #6ab825; font-weight: bold">uniform</span> <span style="color: #6ab825">float</span> <span style="color: #d0d0d0">time;</span>

            <span style="color: #a6e22e">$</span><span style="color: #f8f8f2">{</span><span style="color: #a6e22e">Noise3D</span><span style="color: #f8f8f2">}</span>

            <span style="color: #6ab825; font-weight: bold">void</span> <span style="color: #447fcf">main</span><span style="color: #d0d0d0">()</span> <span style="color: #d0d0d0">{</span>
                <span style="color: #6ab825">float</span> <span style="color: #d0d0d0">speed</span> <span style="color: #d0d0d0">=</span> <span style="color: #3677a9">16.</span><span style="color: #d0d0d0">;</span>
                <span style="color: #6ab825">float</span> <span style="color: #d0d0d0">scale</span> <span style="color: #d0d0d0">=</span> <span style="color: #3677a9">3.5</span><span style="color: #d0d0d0">;</span>

                <span style="color: #6ab825">vec2</span> <span style="color: #d0d0d0">st</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">gl_FragCoord.xy/resolution.xy;</span>
                <span style="color: #d0d0d0">st.x</span> <span style="color: #d0d0d0">*=</span> <span style="color: #d0d0d0">resolution.x/resolution.y;</span>
                <span style="color: #d0d0d0">st</span> <span style="color: #d0d0d0">*=</span> <span style="color: #d0d0d0">scale;</span>

                <span style="color: #6ab825">float</span> <span style="color: #d0d0d0">noise</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">snoise(vec3(st.x,</span> <span style="color: #d0d0d0">st.y,</span> <span style="color: #d0d0d0">time</span> <span style="color: #d0d0d0">*</span> <span style="color: #d0d0d0">speed</span> <span style="color: #d0d0d0">*</span> <span style="color: #3677a9">0.01</span><span style="color: #d0d0d0">));</span>
                <span style="color: #6ab825">float</span> <span style="color: #d0d0d0">c</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">(noise</span> <span style="color: #d0d0d0">+</span> <span style="color: #3677a9">1.</span><span style="color: #d0d0d0">)</span> <span style="color: #d0d0d0">/</span> <span style="color: #3677a9">2.</span><span style="color: #d0d0d0">;</span>

                <span style="color: #d0d0d0">gl_FragColor</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">vec4(c,</span> <span style="color: #d0d0d0">c,</span> <span style="color: #d0d0d0">c,</span> <span style="color: #3677a9">1.</span><span style="color: #d0d0d0">);</span>
            <span style="color: #d0d0d0">}</span></pre>
            <pre style="border: #202020; background: #202020; margin: 0; padding: 0px; overflow: hidden;">   
       <span style="color: #960050; background-color: #1e0010">`</span><span style="color: #f8f8f2">,</span>
       <span style="color: #a6e22e">vertex</span><span style="color: #f92672">: </span><span style="color: #960050; background-color: #1e0010">`</span></pre>
       <pre style="border: #202020; background: #202020; background-color: #1e0010; margin: 0; padding: 0px; overflow: hidden;">

        <span style="color: #6ab825; font-weight: bold">void</span> <span style="color: #447fcf">main</span><span style="color: #d0d0d0">()</span> <span style="color: #d0d0d0">{</span>

            <span style="color: #d0d0d0">gl_Position</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">projectionMatrix</span> <span style="color: #d0d0d0">*</span> <span style="color: #d0d0d0">modelViewMatrix</span> <span style="color: #d0d0d0">*</span> <span style="color: #d0d0d0">vec4(position,</span> <span style="color: #3677a9">1.0</span><span style="color: #d0d0d0">);</span>
        <span style="color: #d0d0d0">}</span></pre>
    <pre style="border: #202020; background: #202020; margin: 0; padding:0px; overflow: hidden;"><span style="color: #960050; background-color: #1e0010">`</span>
    <span style="color: #f8f8f2">}</span></pre>
</td></tr></table></div>



Notice that the noise function is inserted within the fragment shader as a string format (**${Noise3D}**). It is here where the noise function (named **snoise**) is eventually called.

It is in the fragment shader where the action is. The final output is collected in (now deprecated) **gl_FragColor**.

> NOTE: For those who don't know much about shaders, the GLSL used to offer a built-in variable, the **gl_FragColor**, that acted as the final control of the pixel coloring output. In more recent versions of GLSL [gl_FragColor became deprecated](https://community.khronos.org/t/about-gl-fragcolor-of-fragment-shader/105102), allowing user-defined fragment shader outputs using the **out** variable qualifier.

The output of the fragment shader is based on a value "*c*", which is modified based on the noise function.

On the contrary, the code of the vertex shader is quite simple. This is because it relies on [built-in uniform variables](https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram) that will be passed from Three.js - **projectionMatrix**, **modelViewMatrix** and **position**. In the way they are set, it is like: "just render the geometry that will be defined later in the Three.js code".

**THREE.JS AND THE PLANE**

In fact, all what Darryl wanted as geometry was a plane. Building a plane in Three.js is quite simple. You just need to instantiate an scene, usually with a camera and possibly some lights, and then define the plane geometry, the material covering that geometry, then create a mesh with both of them and finally register the mesh into the scene.

In the case of Darryl's project though, the material was *the shader* containing the noise (colouring) function:

<pre>
    <code class="javascript">
<pre class="javascript" style="font-family:monospace;">...
&nbsp;
<span style="color: #660066;">let</span> width <span style="color: #339933;">=</span> container.<span style="color: #660066;">offsetWidth</span><span style="color: #339933;">,</span>
    height <span style="color: #339933;">=</span> container.<span style="color: #660066;">offsetHeight</span><span style="color: #339933;">,</span>
    currentTime <span style="color: #339933;">=</span> <span style="color: #CC0000;">0</span><span style="color: #339933;">,</span>
    timeAddition <span style="color: #339933;">=</span> <span style="">Math</span>.<span style="color: #660066;">random</span><span style="color: #009900;">&#40;</span><span style="color: #009900;">&#41;</span> <span style="color: #339933;">*</span> <span style="color: #CC0000;">1000</span>
&nbsp;
<span style="color: #000066; font-weight: bold;">const</span> scene <span style="color: #339933;">=</span> <span style="color: #000066; font-weight: bold;">new</span> THREE.<span style="color: #660066;">Scene</span><span style="color: #009900;">&#40;</span><span style="color: #009900;">&#41;</span><span style="color: #339933;">,</span>
        camera <span style="color: #339933;">=</span> <span style="color: #000066; font-weight: bold;">new</span> THREE.<span style="color: #660066;">OrthographicCamera</span><span style="color: #009900;">&#40;</span> width <span style="color: #339933;">/</span> <span style="color: #339933;">-</span> <span style="color: #CC0000;">2</span><span style="color: #339933;">,</span> width <span style="color: #339933;">/</span> <span style="color: #CC0000;">2</span><span style="color: #339933;">,</span> height <span style="color: #339933;">/</span> <span style="color: #CC0000;">2</span><span style="color: #339933;">,</span> height <span style="color: #339933;">/</span> <span style="color: #339933;">-</span> <span style="color: #CC0000;">2</span><span style="color: #339933;">,</span> <span style="color: #CC0000;">0</span><span style="color: #339933;">,</span> <span style="color: #CC0000;">100</span> <span style="color: #009900;">&#41;</span>
&nbsp;
renderer <span style="color: #339933;">=</span> <span style="color: #000066; font-weight: bold;">new</span> THREE.<span style="color: #660066;">WebGLRenderer</span><span style="color: #009900;">&#40;</span><span style="color: #009900;">&#123;</span> alpha<span style="color: #339933;">:</span> <span style="color: #003366; font-weight: bold;">true</span> <span style="color: #009900;">&#125;</span><span style="color: #009900;">&#41;</span>
&nbsp;
renderer.<span style="color: #660066;">setSize</span><span style="color: #009900;">&#40;</span> container.<span style="color: #660066;">offsetWidth</span><span style="color: #339933;">,</span> container.<span style="color: #660066;">offsetHeight</span> <span style="color: #009900;">&#41;</span>
<span style="color: #006600; font-style: italic;">//container.appendChild(renderer.domElement)</span>
...
&nbsp;
<span style="color: #006600; font-style: italic;">//(the shaderMaterial is defined just before the geometry instantiation bellow)</span>
&nbsp;
let geometry <span style="color: #339933;">=</span> <span style="color: #000066; font-weight: bold;">new</span> THREE.<span style="color: #660066;">PlaneGeometry</span><span style="color: #009900;">&#40;</span> width<span style="color: #339933;">,</span> height<span style="color: #339933;">,</span> <span style="color: #CC0000;">32</span> <span style="color: #009900;">&#41;</span><span style="color: #339933;">;</span>
let plane <span style="color: #339933;">=</span> <span style="color: #000066; font-weight: bold;">new</span> THREE.<span style="color: #660066;">Mesh</span><span style="color: #009900;">&#40;</span> geometry<span style="color: #339933;">,</span> shaderMaterial <span style="color: #009900;">&#41;</span><span style="color: #339933;">;</span>
scene.<span style="color: #660066;">add</span><span style="color: #009900;">&#40;</span> plane <span style="color: #009900;">&#41;</span><span style="color: #339933;">;</span>
plane.<span style="color: #660066;">position</span>.<span style="color: #660066;">z</span> <span style="color: #339933;">=</span> <span style="color: #CC0000;">0.5</span><span style="color: #339933;">;</span>
&nbsp;
&nbsp;
camera.<span style="color: #660066;">position</span>.<span style="color: #660066;">y</span> <span style="color: #339933;">=</span> <span style="color: #CC0000;">0</span><span style="color: #339933;">;</span>
camera.<span style="color: #660066;">position</span>.<span style="color: #660066;">x</span> <span style="color: #339933;">=</span> <span style="color: #CC0000;">0</span><span style="color: #339933;">;</span>
camera.<span style="color: #660066;">position</span>.<span style="color: #660066;">z</span> <span style="color: #339933;">=</span> <span style="color: #CC0000;">100</span><span style="color: #339933;">;</span>
&nbsp;
...</pre>
    </code>
</pre>

```javascript
12 let shaderMaterial = new THREE.ShaderMaterial( {
13    uniforms:       uniforms,
14    vertexShader:   shaders.vertex,
15    fragmentShader: shaders.fragment,
16    //blending:       THREE.AdditiveBlending,
17    depthTest:      false,
18    transparent:    true,
19    vertexColors:   true
20 });
```


```javascript
...

let width = container.offsetWidth,
    height = container.offsetHeight,
    currentTime = 0,
    timeAddition = Math.random() * 1000

const scene = new THREE.Scene(),
        camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0, 100 )

renderer = new THREE.WebGLRenderer({ alpha: true })

renderer.setSize( container.offsetWidth, container.offsetHeight )
//container.appendChild(renderer.domElement)
...

//(the shaderMaterial is defined just before the geometry instantiation bellow)

let geometry = new THREE.PlaneGeometry( width, height, 32 );
let plane = new THREE.Mesh( geometry, shaderMaterial );
scene.add( plane );
plane.position.z = 0.5;


camera.position.y = 0;
camera.position.x = 0;
camera.position.z = 100;

...
```
{% highlight javascript %}
...

let width = container.offsetWidth,
    height = container.offsetHeight,
    currentTime = 0,
    timeAddition = Math.random() * 1000

const scene = new THREE.Scene(),
        camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0, 100 )

renderer = new THREE.WebGLRenderer({ alpha: true })

renderer.setSize( container.offsetWidth, container.offsetHeight )
//container.appendChild(renderer.domElement)
...

//(the shaderMaterial is defined just before the geometry instantiation bellow)

let geometry = new THREE.PlaneGeometry( width, height, 32 );
let plane = new THREE.Mesh( geometry, shaderMaterial );
scene.add( plane );
plane.position.z = 0.5;


camera.position.y = 0;
camera.position.x = 0;
camera.position.z = 100;

...

{% endhighlight %}

**THE MATERIAL OF THE PLANE**

There is something important when coding with WebGL - you need some way to pass data from outside the shader to the GLSL shader context. The way that is done is through ***uniforms***, which are special GLSL variable qualifiers to identify exactly those variables that could act as inputs.

```javascript
...

let uniforms = {
    time: { value: 1 + timeAddition },
    resolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) }
}

...
```

The uniform that will be important for Darryl's code is the **time** uniform. It will set the pace of the advance of the color of the pixels along the gradient of the noise function. 

Having the corresponding uniforms and the shaders allow for the construction of the Three.js's shader Material instance, named **shaderMaterial** in the code. The shader material is defined a few lines before the instantiation of the plane geometry and right after the uniforms. 

```javascript
...

let shaderMaterial = new THREE.ShaderMaterial( {
    uniforms:       uniforms,
    vertexShader:   shaders.vertex,
    fragmentShader: shaders.fragment,
    //blending:       THREE.AdditiveBlending,
    depthTest:      false,
    transparent:    true,
    vertexColors:   true
});

...
```

# Tada!

In the Darryl's project, the **noiseCanvas** function ended with the **render** function. The render function updates the graphics using the **requestAnimationFrame** but before the rendering the **time** uniform is updated.

```javascript
...
    //these variables were instantiated high in the code, under the shaders
    currentTime = 0,
    timeAddition = Math.random() * 1000
...

function render() {
    var now = new Date().getTime();
    currentTime = (now - startTime) / 1000;
    uniforms.time.value = currentTime + timeAddition;

    requestAnimationFrame( render );
    renderer.render( scene, camera );
}
render();
...
```

The value of the **time** uniform is increased at each rendering frame using a simple implemantion based on the system clock.

If you reviewed the code you might have notice that the Three.js renderer and plane had dimensions but that they were not added to any HTML element. That was made on purpose by the author - the apparent changes on the texture of the Three.js plane should stay invisible to the observer.

If you are interested in seeing how the noise function behaves, I have revealed the function by adding it to an HTML element:

<div id="threejs-container"></div>

<script src="{{ site.baseurl }}{% link src/vendor/js/threejs/v104/three.v104.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02.js %}"></script>
<script type="module" src="{{ site.baseurl }}{% link src/posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/huffman-flow-field-setup-02.js %}"></script>

# So... What did we learn from this code?

In this second part of our analysis of the Darryl Huffman's "Perlin Flow Field" we got the basic ideas of the use of shaders and noise functions in combination with Three.js. We are also unveiling a couple facts, like keeping the noise function invisible to the observer.

In fact, Darryl kept that invisible because his only interest was to extract values from the noise function without showing the graphics, giving this idea of "invisible force" affecting the movement of the "hairs" rendered on the "context" canvas.

However, he needed a way to extract the values from the invisible noise function into the visible canvas. There is a common trick used for that, using again the canvas API as adapter. We will go through it in a third and last post about Darryl's pen.

 For now, happy coding!

