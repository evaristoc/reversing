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
            <p>Let's draw two points, <strong>A</strong> and <strong>B</strong> at any place of a cartesian plane, each defined by their <strong>(x,y)</strong> coordinates, being <strong>d</strong> > 0 the distance between those two points.</p>
          </div>
        </div>
        <div class='step' data-step='2'>
            <div class="explain">
                <p>Let's start simple by assigning the same y-coordinate to both points.</p>
            </div>
        </div>
        <div class='step' data-step='3'>
            <div class="explain">
                <p>Now let's draw a segment between our points A and B. Let's call it the segment <strong>AB</strong></p>
            </div>
        </div>
        <div class='step' data-step='4'>
            <div class="explain">
                <p>A circle could be defined as "<strong><i>all the points from the same distance called the</i> radius <i>to a point called the</i> center</strong>". That means that in order for our points A and B to be part of a circle, they have to be at a distance of radius <i>r</i> to the center of that circle.</p>
                <p>Under the previously stated conditions, how many circles would contain our two points if we don't specify any radius?</p>
            </div>
        </div>
        <div class='step' data-step='5'>
            <div class="explain">
                <p>Here one example: a circle of radius equal to the half of the distance between A and B, with the middle point <strong>M</strong> between A and B as its center.</p>
            </div>
        </div>
        <div class='step' data-step='6'>
            <div class="explain">
                <p>There are other circles. Let's see some!</p>
            </div>
        </div>        
        <div class='step' data-step='7'>
            <div class="explain">
            </div>
        </div>
        <div class='step' data-step='8'>
            <div class="explain">
                <p>In fact, we can draw infinite number of circles <i>as long as their radii are equal or larger than the half distance between A and B.</i></p>
            </div>
        </div>
        <div class='step' data-step='9'>
            <div class="explain">
                <p>Notice that all the circles touch our two points while their centers get further away from our point M.</p>
            </div>
        </div>
        <div class='step' data-step='10'>
            <div class="explain">        
                <p>And that is not all: we can include the circles in the opposite direction too.</p>
                <p>All of those circles form a <i>family of circles</i> containing our points A and B.</p>
            </div>
        </div>
        <div class='step' data-step='11'>
            <div class="explain">        
                <p>One peculiarity of this circle family is that their centers are <i>colinear</i> over the perpendicular to the segment AB passing through the middle point M.</p>
            </div>
        </div>
        <div class='step' data-step='12'>
            <div class="explain">        
                <p>Now, the exercise gives us the two points and a radius. Let's say we got the radius of the following ones...</p>
            </div>
        </div>
        <div class='step' data-step='13'>
            <div class="explain">        
                <p>... but we still don't know the coordinates of their centers, so we are not able to provide a numeric (programmatic) solution.</p>
            </div>
        </div>
        <div class='step' data-step='14'>
            <div class="explain">        
                <p>What we know is that they are at a distance equals to the given radius <i>r</i>.</p>
                <p>We have also learned that they are colinear to the middle point M. And because we know the length of the segment AB, we can also calculate the distance between A or B to M, which is... the half :).</p>
            </div>
        </div>
        <div class='step' data-step='15'>
            <div class="explain">        
                <p>Actually, M is at the half distance between the centers of our two circles of radius <i>r</i>. BUT notice that the centers are at distance r to A and B but not to M.</p>
                <p>The good news are: we have enough information to calculate how far is M to the center of any of the circles. Let's select the point A and let's try to get the center of the inferior circle.</p>
            </div>
        </div>
        <div class='step' data-step='16'>
            <div class="explain">        
            </div>
        </div>
        <div class='step' data-step='17'>
            <div class="explain">        
                <p>I hope you will agree with me that the shape we have highlighted is a rectangular triangle, which allows us to find a solution to the distance between M and one of the centers using Pitagoras.</p>
            </div>
        </div>
        <div class='step' data-step='18'>
            <div class="explain">        
                <p>This is a good work! We have a bunch of good information. However, now it comes the cumbersome part: <strong><i>that information has to be translated into xy-coordinates</i></strong>.</p>
                <p>For our case looks relatively simple, by adding or substracting the found distances to the point M. The challenge of the problem lies on the fact that points A and B can be wherever in our plane. For example, let's say we had a different point A.</p>
            </div>
        </div>
        <div class='step' data-step='19'>
            <div class="explain">        
                <p>This is a <i>rotation</i> of the geometry. Here we won't get the right solution by adding or substracting the found distances to existing coordinates. We need to find the <i>projection</i> of the rotated segments into the corresponding coordinates. And that requires some trigonometry. In fact, for a generalizable solution we need to consider the calculation of those projections.</p>
                <p></p>
            </div>
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

