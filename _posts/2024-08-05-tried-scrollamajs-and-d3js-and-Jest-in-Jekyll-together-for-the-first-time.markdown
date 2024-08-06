---
layout: post
title:  "I tried scrollama.js with d3.js and Jest in Jekyll together for the first time"
date:   2024-08-05 12:00:00 +0200
categories: update
---


I keep exploring technologies for my posts involving the use of the storytelling approach.

I just recently [finished a post]({{site.baseurl}}{% link _posts/2024-08-05-tried-scrollamajs-and-d3js-and-Jest-in-Jekyll-together-for-the-first-time.markdown %}) where I started to experiment with combining [d3.js](https://d3js.org/) and [scrollama.js](https://github.com/russellsamora/scrollama). There were some positives after using both of them.

One of the things about scrollama.js is that it is a very easy package to use, with very simple configurations.

d3.js is not that simple as it sometimes requires a non-intuitive approach, but it is very powerful. And one you understand the work cycle it allows more generalization and less code.

But my project ended with a couple of serious deficiencies in terms of performance and consistency of the rendering. 

It is very likely that I am missing something, but it could be also those two technologies might not be adequate for projects of certain complexity. For example, the simplity of the scrollama.js package based on a single sometimes unprecised event might not be the thing you are looking for complex storytelling projects.

d3.js is, again, very powerful and it is here where I think I could have done better. But I suspect that it still won't do great if you rely completely on its animation features, the transitions. One of the things I discovered is that if you run through an animation and for some reason change to another animation before the previous one finishes, then the whole animation goes wrong with several inconsistencies. That is because, as I worked it in my project, the transitions were not listening to each other.

I am sure this is something that can be fixed, but I wonder if another, more dedicated animation package wouldn't be necessary.

Despite of all those issues I decided to keep that post without modifications (this is an edit at 08-2024) and move on. In fact, I will use those two technologies for my next project even if I was not completely satisfied with the result.

But I will keep improving it in future projects as I understand better what to expect for those two.

It is worth mentioning that I am always evaluating my workflow and the tools I use every time I start a new post. This was also the appropiate time to introduce some [Babel](https://babeljs.io/) and [Jest](https://jestjs.io/). I already had planned to practice unit testing for my projects for a while :).

I must say... combining Jekyll and Jest for unit-testing your custom javascript while also using ESM could lead to a lot of inconveniences. To start with Jekyll not being friendly to node_modules. But then Jest not being friendly to ESM. To date, I haven't found a solution for all that and I am resourcing to manual work :(.

This unpractical approach is a motivation to revise first the use of Vitest as well as probably moving earlier a date for adopting another CMS and hosting more compatible with Javascript stack, which it was still in my plans anyway. My objective is to find something that allows me to separate code from content, which I am not doing at the moment. And I cannot keep using Git for content version management... that is wrong.