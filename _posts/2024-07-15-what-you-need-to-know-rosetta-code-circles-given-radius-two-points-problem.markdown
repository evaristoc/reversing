---
layout: post
title:  "What you need to know to solve... the Rosetta Code's 'circles of given radius through 2 points'  problem"
date:   2024-07-15 12:00:00 +0200
categories: blog what-you-need-to
---

<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/posts/2024-07-15-rosetta-code-circles-between-two-points-problem/style/scrollama-setup-v03.css %}">

No long time ago I was visiting the Freecodecamp forum to see how I could help. Then I found [a question that took my attention](https://forum.freecodecamp.org/t/circles-of-given-radius-through-two-points/688719).

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-07-15-rosetta-code-circles-between-two-points-problem/img/Circles through points 2024-07-26.png %}" style="width:100%;">

The question was one of the many code problems listed in a section of the Freecodecamp curriculum to practice for code interviews. Specifically, the question was one under the [Rosetta Code problems](https://www.freecodecamp.org/learn/rosetta-code/).

Freecodecamp provides an interface to Freecodecamp students to try the exercises. For example, here it is [the presentation of the problem in the Freecodecamp site](https://www.freecodecamp.org/learn/rosetta-code/rosetta-code-challenges/circles-of-given-radius-through-two-points).

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-07-15-rosetta-code-circles-between-two-points-problem/img/Freecodecamp Circles through Points 2024-07-26.png %}" style="width:100%;">

However, the [Rosetta Code project](https://rosettacode.org) is actually a different project to Freecodecamp. It is in fact a collection of problems for coding practice and examples. There people are also suggested to provide solutions in different programming languages. And you can find exactly the same problem posted on the Rosetta Code webpages: [Circles_of_given_radius_through_two_points](https://rosettacode.org/wiki/Circles_of_given_radius_through_two_points).

Furthermore, the Rosetta Code project allows users to provide example solutions to the posted problems. 

To the time of this writing, this was the solution given in Javascript:

```js
const hDist = (p1, p2) => Math.hypot(...p1.map((e, i) => e - p2[i])) / 2;
const pAng = (p1, p2) => Math.atan(p1.map((e, i) => e - p2[i]).reduce((p, c) => c / p, 1));
const solveF = (p, r) => t => [r*Math.cos(t) + p[0], r*Math.sin(t) + p[1]];
const diamPoints = (p1, p2) => p1.map((e, i) => e + (p2[i] - e) / 2);

const findC = (...args) => {
  const [p1, p2, s] = args;
  const solve = solveF(p1, s);
  const halfDist = hDist(p1, p2);

  let msg = `p1: ${p1}, p2: ${p2}, r:${s} Result: `;
  switch (Math.sign(s - halfDist)) {
    case 0:
      msg += s ? `Points on diameter. Circle at: ${diamPoints(p1, p2)}` :
        'Radius Zero';
      break;
    case 1:
      if (!halfDist) {
        msg += 'Coincident point. Infinite solutions';
      }
      else {
        let theta = pAng(p1, p2);
        let theta2 = Math.acos(halfDist / s);
        [1, -1].map(e => solve(theta + e * theta2)).forEach(
          e => msg += `Circle at ${e} `);
      }
      break;
    case -1:
      msg += 'No intersection. Points further apart than circle diameter';
      break;
  }
  return msg;
};
```
There was no much follow up in the Freecodecamp thread after all, but I still wanted to check the problem, only to find what there appeared to be a couple of discrepancies in the solution given on the Rosetta Code project.

This motivated me to make a revision of the problem. In this post I am going to **visually show a few things that we should keep in mind in order to get a possible solution to the coding problem**, without directly giving you a code.

I will end this post with a short discussion about my findings and how they compare to the Rosetta Code solution.

Ok, let's get this started!

# In Action

<section id='stickyoverlay'>
    <figure id="scrollfig">
    </figure>
    <div id="test"></div>
    <div class="articlepost">
        <div class='step' data-step='1'>
            <div class="explain">
            1
            <p>Let's draw two points, <strong>A</strong> and <strong>B</strong> at any place of a cartesian plane, each defined by their <strong>(x,y)</strong> coordinates, being <strong>d</strong> > 0 the distance between those two points.</p>
          </div>
        </div>
        <div class='step' data-step='2'>
            <div class="explain">
            2
                <p>Let's start simple by assigning the same y-coordinate to both points.</p>
            </div>
        </div>
        <div class='step' data-step='3'>
            3
            <div class="explain">
                <p>Now let's draw a segment between our points A and B. Let's call it the segment <strong>AB</strong></p>
            </div>
        </div>
        <div class='step' data-step='4'>
            4
            <div class="explain">
                <p>A circle could be defined as "<strong><i>all the points from the same distance called the</i> radius <i>to a point called the</i> center</strong>". That means that in order for our points A and B to be part of a circle, they have to be at a distance of radius <i>r</i> to the center of that circle.</p>
                <p>Under the previously stated conditions, how many circles would contain our two points if we don't specify a radius?</p>
            </div>
        </div>
        <div class='step' data-step='5'>
            5
            <div class="explain">
                <p>Here one example: a circle of radius equal to the half of the distance between A and B, with the middle point <strong>M</strong> between A and B as its center.</p>
            </div>
        </div>
        <div class='step' data-step='6'>
            6
            <div class="explain">
                <p>There are other circles. Let's see some!</p>
            </div>
        </div>        
        <div class='step' data-step='7'>
            7
            <div class="explain">
            </div>
        </div>
        <div class='step' data-step='8'>
            8
            <div class="explain">
                <p>In fact, we can draw infinite number of circles <i>as long as their radii are equal or larger than the half distance between A and B.</i></p>
            </div>
        </div>
        <div class='step' data-step='9'>
            9
            <div class="explain">
                <p>Notice that all the circles touch our two points while their centers get further away from our point M.</p>
            </div>
        </div>
        <div class='step' data-step='10'>
            10
            <div class="explain">        
                <p>And there are more: we can include the circles in the opposite direction too.</p>
                <p>All those circles form a <i>family of circles</i> containing our points A and B.</p>
            </div>
        </div>
        <div class='step' data-step='11'>
            11
            <div class="explain">        
                <p>One peculiarity of this circle family is that their centers are <i>colinear</i>: they also belong to the perpendicular to the segment AB that passes through the middle point M.</p>
            </div>
        </div>
        <div class='step' data-step='12'>
            12
            <div class="explain">        
                <p>Now, the exercise gives us two points and a radius. We have already spoken about the points. Let's say we got a radius corresponding to the following circles...</p>
            </div>
        </div>
        <div class='step' data-step='13'>
            13
            <div class="explain">        
                <p>... but because <i>we still don't know the coordinates of their centers</i> we are not able to provide a numeric (programmatic) solution :(.</p>
                <p>So another way to pose part of our problem would be: <strong>How do we code a script that calculates the cooordinates of the centers of any of the circles of the corresponding circle family, given a radius and the two points?</strong></p>
            </div>
        </div>
        <div class='step' data-step='14'>
            14
            <div class="explain">        
                <p>Let's see what we have so far: the two points and the radius are given. We have also learned that the centers are colinear to the perpendicular that passes through the middle point M. And because we know the length of the segment AB and the radius, we can also calculate some distances.</p>
            </div>
        </div>
        <div class='step' data-step='15'>
            15
            <div class="explain">        
                <!--<p>Another thing to keep in mind is that M is at the half distance between the centers of our two concerning circles. Notice though that although the centers are at distance <i>r</i> to A and B, they are not to the same distance to M.</p>-->
                <p>Let's select the point A and let's draw some useful distances pointing to the center one of the possible circles.</p>
            </div>
        </div>
        <div class='step' data-step='16'>
            16
            <div class="explain">
                <p>I hope you will agree with me that the shape we have highlighted ressembles a side and hypotenuse of a rectangular triangle, which allows us to find a solution for the distance between M and one of the centers using Pitagoras.</p>   
            </div>
        </div>
        <div class='step' data-step='17'>
            17
            <div class="explain">        
                <p>This is a bunch of good information! But this is still not enough: we still need to <strong><i>translate that information into xy-coordinates</i></strong>.</p>
                <p>For the simple case where the AB segment is parallel to the the x-coord as our current example, finding the right coordinates of the centers would be as simple addition and substraction to the coordinates of the point M. The challenge of the problem lies on the fact that points A and B can be wherever in our plane. For example, let's say we had a different point A.</p>
            </div>
        </div>
        <div class='step' data-step='18'>
            18
            <div class="explain">        
                <p>This is a <i>rotation</i> of the geometry. Here we won't get the right solution by simply adding or substracting to the point M. We need to find the <i>projection</i> of the rotated segments into the x and y axes of our cartesian plane. And that requires some trigonometry. In fact, for a generalizable solution we need to consider the calculation of those projections.</p>
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

<script type="module" src="{{ site.baseurl }}{% link mngassets/posts/2024-07-15-rosetta-code-circles-between-two-points-problem/js/scrollama-setup-v03.js %}"></script>


# Tada!



# So... What did we learn from this code?


# Final Remarks

I wish you happy coding!

