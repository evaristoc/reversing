---
layout: post
title:  "Rosetta Code: 'circle between 2 points'  problem"
date:   2024-07-15 12:00:00 +0200
categories: blog update
---

<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/styles/table-code-highlight.css %}">
<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/posts/2024-07-15-rosetta-code-circles-between-two-points-problem/scrollama-setup-v03.css %}">

The [Rosetta Code project](https://rosettacode.org) is a collection of problems for coding practice and examples. There people are also suggested to provide solutions in different programming languages.

One of those problems that should be solved by beginners is the following:

> Given two points on a plane and a radius, **usually** two circles of given radius can be drawn through the points.

You can find more information about the problem on the problem's webpage:

[Circles_of_given_radius_through_two_points](https://rosettacode.org/wiki/Circles_of_given_radius_through_two_points)

 

In this post I am going to check the aforementioned Rosetta Code problem by providing **a visual reconstruction of some of the mathematical basics that explain the exercise and its solution**.

However, it is important to clarify the scope of my solution:
* There are one general solution ("*...usually two circles...*"") and 4 cases. I will focus on *an example* of the general solution, briefly touching some of the cases.
* I will put more attention to the theory used in [the Javascript solution for this problem](https://rosettacode.org/wiki/Circles_of_given_radius_through_two_points#JavaScript), expanded and with some variants.
* Furthermore, my solution has strong dependency on the selected data (eg. points, angles, etc). I will clarify which ones I am using for my solution and I will stick to them for a more general *code* solution.

After working on my visualization **I ended up with a slightly different solution** to the one given on the webpage of the exercise. However, the idea of this post is not to discuss my code, but rather focusing on the concepts and the strategy that I used to visualize the problem. I expect that the explanation will give you additional inputs to come with *your own* solution.

I will end this post with a short discussion about my findings and things that I think we should consider when trying to come up with a better, nicer solution.

Ok, let's get this started!

# In Action

<section id='stickyoverlay'>
    <figure id="scrollfig">
    </figure>
    <div id="test"></div>
    <div class="articlepost">
        <div class='step' data-step='1'>
            <div class="explain">
            <p>Let's draw two points, <strong>A</strong> and <strong>B</strong> in any cartesian plane and each defined by their <strong>(x,y)</strong> coordinates.</p>
          </div>
        </div>
        <div class='step' data-step='2'>
            <div class="explain">
            <p></p>
            </div>
        </div>
        <div class='step' data-step='3'>
            <div class="explain">
            </div>
        </div>
<div class='step' data-step='4'>
            <div class="explain">
            </div>
</div>
        <div class='step' data-step='5'>
            <div class="explain">
            </div>
        </div>
        <div class='step' data-step='6'>
            <div class="explain">
            </div>
        </div>        
        <div class='step' data-step='7'>
            <div class="explain">
            </div>
        </div>
        <div class='step' data-step='8'>
        </div>
        <div class='step' data-step='9'>
        </div>
    </div>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
</section>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/D3js/v7.8.5/d3.v7.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/scrollama/v2.1.2/scrollama.v2.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/stickyfill/v2.1.0/stickyfill.v2.min.js %}"></script>

<script type="module" src="{{ site.baseurl }}{% link mngassets/posts/2024-07-15-rosetta-code-circles-between-two-points-problem/scrollama-setup-v03.js %}"></script>


# Tada!



# So... What did we learn from this code?


# Final Remarks

I wish you happy coding!

