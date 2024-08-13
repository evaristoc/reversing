---
layout: post
title:  "I tried scrollama.js with d3.js and Jest in Jekyll together for the first time"
date:   2024-08-05 12:00:00 +0200
categories: update
---

I just recently [finished a post]({{site.baseurl}}{% link _posts/2024-08-05-tried-scrollamajs-and-d3js-and-Jest-in-Jekyll-together-for-the-first-time.markdown %}) where I started to experiment with combining [d3.js](https://d3js.org/) and [scrollama.js](https://github.com/russellsamora/scrollama), as well as [Jest](https://jestjs.io/) - with [Babel](https://babeljs.io/) - on [jekyll](https://jekyllrb.com/). There were some positives after using both of them. But also a few problems. Here how my experience has been so far with those technologies.

# d3.js and scrollama.js

One of the things about scrollama.js is that it is a very easy package to use, with very simple configurations. And although d3.js is not particulary simple, it is extremely powerful. After understanding its work cycle you will be able to make complex graphics with less code and more generality.

By combining them, I was looking for a simple event handler for relatively advanced graphics.

But my project ended with a couple of serious deficiencies in terms of performance and rendering consistency. 

One of the things I discovered while working with them for the first time was that if you run through an animation and for some reason change to another animation before the previous one finishes, then the whole animation goes wrong. That is because, as I later discovered, the d3.js' transitions were not listening to each other and they were not waiting for the previous one to finish before starting, interrupting the completion of the transition.

There are a few other "glitches" in my code that require further attention.

d3.js is, again, very powerful and it is here where I think I could have done better. But I suspect that any project won't do particularly great if relying completely only on d3.js animation features as in my post. It is very likely that I am missing something, but it could be also those two technologies might not be adequate for projects of certain complexity. For example, the simplity of the scrollama.js package based on a single sometimes unprecised event might not be the thing you are looking for complex storytelling projects.

I wonder if another, more dedicated animation package wouldn't be necessary.

# jest and jekyll

Another thing I feel worth mentioning is that I started introducing unit tests for the code I am developing. I did it while working on the same post where I used scrollama.js and d3.js for the first time.

My experience with Jest is still good. I like the tool. But trying to keep a smooth workflow of unit-testing  on Jekyll on Github Pages is not easy. Jekyll *hates* node_modules.

Another problem I found was the configuration of Jest to accept ESM links. I was introducing ESM imports into my files, [persuaded of the benefits of the approach](https://dev.to/asyncbanana/how-to-use-esm-on-the-web-and-in-nodejs-3k04). I feel they will be a good solution for a project like mine, where I use static files and no backend. But Jest is not very friendly to ESMs.

To date, I haven't found a solution on how to work with node_modules from an external location that satisfy me, nor on how to set Jest to accept ESM links. But the ESM links is likely easier to solve in the near future. 

The fact is that for now I keep reconfiguring my project for test and back to development settings by moving manually some files and commenting code :(.

# remarks

Despite of all those issues I decided to keep that post without further modifications (this is an edit at 08-2024) and move on. This project is: I will take technologies and solutions previously used and try to improve the results when necessary in future posts. That is because this blog allows me to test and develop tools but it is also a place to deliver content, and I don't want to stay hucked in a specific problem for too long. 

However, specially because the unpracticalities due to the testing / development reconfiguration I will begin to revise other platform options. The thing is, I could go and try to implement a solution for those problems, but I would rather find a simpler solution than putting effort on a task that was not conceived as a priority when starting this blog - solving Jekyll to work with Jest, for example.

For testing, I will try Vitest and see how it behaves. I will also be looking for an OS CSM platform that allows better content management as well as the insertion of Javascript code, and try to separate both. When I started with this blog it became quickly clear that using Git for content management is just wrong.