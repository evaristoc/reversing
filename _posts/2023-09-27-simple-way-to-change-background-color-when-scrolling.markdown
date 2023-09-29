---
layout: post
title:  "Simple way to change the background color when scrolling"
date:   2023-09-27 12:00:00 +0200
categories: blog update
---
<link rel="stylesheet" href="{{ site.baseurl }}{% link src/posts/2023-09-27-simple-way-to-change-background-color-when-scrolling/2023-09-27-how-to-change-background-color-when-scrolling.css %}">

# Hello, scrollMagic!

Adding animation when scrolling is one of the most popular animations you can ever find. There are many ways of adding those animations but for quite some time one of the most used tools has been [scrollMagic](https://scrollmagic.io/).

Here it is an example of the use of **scrollMagic** by someone who has been learning to use it. The code used for this post is based on a work by Yasser Aziz and can be found at 
[codepen](https://codepen.io/yasserius/pen/rNmExLN){:target="_blank"}.

> I advice to open that pen so you can study the scripts along with this post

<div class="container">
    <section class="slide" id="first">
        <h3>First Step: Declaring the scrollMagic controller</h3>
        <p>The scrollMagic controller is the object that supervises the animation. If you have a set of animations that are commonly related, declaring a single controller for all of them might be the right thing to do.</p>
        <p>This is what our coder did first:</p>
            <div class="language-javascript highlighter-rouge centered-content">
            <div class="highlight">
                <pre class="highlight">
                    <code>    
    <span class="kd">var</span> <span class="nx">controller</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">ScrollMagic</span><span class="p">.</span><span class="nx">Controller</span><span class="p">()</span>
                    </code>
                </pre>
            </div>
        </div>
        <div class="centered-content title"><h1>Now, scroll to see color change...</h1></div>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>  
    </section>
    <section class="slide" id="second">
        <h3>Second Step: Instantiating the Red Scene</h3>
            <p><strong>scrollMagic</strong> needs an anchor or trigger in the HTML to indicate where the new scene should start and where should end. Some coders might interpret the start and end of a transformation as different <strong>scenes</strong>. The author of this code separated the triggers of the scenes into <em>HTML sections</em>. There are 5 sections in this code, each section identified with an id ('first', 'second', 'third', 'fourth' and 'fifth'). Those ids are used to tell <strong>scrollMagic</strong> "Hey, this is the next scene!".</p>
            <div class="language-javascript highlighter-rouge">
                <div class="highlight">
                    <pre class="highlight">
                        <code>
        <span class="kd">var</span> <span class="nx">second</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">ScrollMagic</span><span class="p">.</span><span class="nx">Scene</span><span class="p">({</span>
                                <span class="na">triggerElement</span><span class="p">:</span> <span class="dl">'</span><span class="s1">#second</span><span class="dl">'</span><span class="p">,</span>
                                <span class="na">duration</span><span class="p">:</span> <span class="dl">"</span><span class="s2">100%</span><span class="dl">"</span><span class="p">,</span>
                            <span class="p">})</span>
                            <span class="p">.</span><span class="nx">setClassToggle</span><span class="p">(</span><span class="dl">'</span><span class="s1">body</span><span class="dl">'</span><span class="p">,</span> <span class="dl">'</span><span class="s1">red-bg</span><span class="dl">'</span><span class="p">)</span>
                            <span class="c1">//.addIndicators() // remove this before publishing</span>
                            <span class="p">.</span><span class="nx">addTo</span><span class="p">(</span><span class="nx">controller</span><span class="p">);</span>
                        </code>
                    </pre>
                </div>
            </div>
            <p>This code reads something like:</p>
            <div class="highlight" style="color: black;">
            "<em>When finding a trigger with value equal 'second', add to body the red-bg class in an animated way</em>"
            </div>
            <p>Let's explain in more detail how the <strong>scene</strong> object is instantiated:</p>
            <p>The very first change should occur when we reach an HTML element, in this case a section, with an id of value equal '<em>second</em>'. The selector was assigned to the <span class='highlight'><strong>triggerElement</strong></span> property of the new <span class='highlight'><strong>ScrollMagic.Scene</strong></span>. Similarly, the element to be affected - in this case the HTML <strong>body</strong> - should be styled based on a class, <strong style='color:brown;'>red-bg</strong>, that <strong>scrollMagic</strong> should add to it. The author defined the new styling in a css file. Then, the <span class='highlight'><strong>setClassToggle</strong></span> property of the <strong>scene</strong> will keep the target HTML element and its new styling.</p>
            <p>Notice that the <strong>scene</strong> is added to the <strong>controller</strong> at the end of the code.</p>     
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>  
    </section>
    <section class="slide" id="third">
        <h3>Third Step: Repeating Code - A Green Scene</h3>
            <p>Here it is something interesting. Notice that the approach of the author consisted <em>in instantiating a new scene object for each section</em>.</p>
            <p>To save time, our author just copied and pasted the code to instantiate a new <strong>scene</strong> object modifying only the assigned values of <span class='highlight'><strong>triggerElement</strong></span> and <span class='highlight'><strong>setClassToggle</strong></span> - the last with a different class, <strong style='color:brown;'>green-bg</strong>. The <strong>controller</strong> assumes that this is a different scene, so it removes every styiling of the previous scenes and replace them with the new ones.</p>
            <p>Here it is the third scene, changing the background to green:</p>
            <div class="language-javascript highlighter-rouge">
                <div class="highlight">
                    <pre class="highlight">
                        <code>
        <span class="kd">var</span> <span class="nx">second</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">ScrollMagic</span><span class="p">.</span><span class="nx">Scene</span><span class="p">({</span>
                                <span class="na">triggerElement</span><span class="p">:</span> <span class="dl">'</span><span class="s1">#third</span><span class="dl">'</span><span class="p">,</span>
                                <span class="na">duration</span><span class="p">:</span> <span class="dl">"</span><span class="s2">100%</span><span class="dl">"</span><span class="p">,</span>
                            <span class="p">})</span>
                            <span class="p">.</span><span class="nx">setClassToggle</span><span class="p">(</span><span class="dl">'</span><span class="s1">body</span><span class="dl">'</span><span class="p">,</span> <span class="dl">'</span><span class="s1">green-bg</span><span class="dl">'</span><span class="p">)</span>
                            <span class="c1">//.addIndicators() // remove this before publishing</span>
                            <span class="p">.</span><span class="nx">addTo</span><span class="p">(</span><span class="nx">controller</span><span class="p">);</span>
                        </code>
                    </pre>
                </div>
            </div> 
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>    
    </section>
    <section class="slide" id="fourth">
        <h3>Fourth Step: And Again...: Blue Scene</h3>
            <p>There is one more instantiation before the code ends, this time changing the background to blue. The code is just the same as before except for the values of <span class='highlight'>triggerElement</span> and the <span class='highlight'>setClassToggle</span>.</p>
            <div class="language-javascript highlighter-rouge">
                <div class="highlight">
                    <pre class="highlight">
                        <code>
        <span class="kd">var</span> <span class="nx">fourth</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">ScrollMagic</span><span class="p">.</span><span class="nx">Scene</span><span class="p">({</span>
                                <span class="na">triggerElement</span><span class="p">:</span> <span class="dl">'</span><span class="s1">#fourth</span><span class="dl">'</span><span class="p">,</span>
                                <span class="na">duration</span><span class="p">:</span> <span class="dl">"</span><span class="s2">100%</span><span class="dl">"</span><span class="p">,</span>
                            <span class="p">})</span>
                            <span class="p">.</span><span class="nx">setClassToggle</span><span class="p">(</span><span class="dl">'</span><span class="s1">body</span><span class="dl">'</span><span class="p">,</span> <span class="dl">'</span><span class="s1">blue-bg</span><span class="dl">'</span><span class="p">)</span>
                            <span class="c1">//.addIndicators() // remove this before publishing</span>
                            <span class="p">.</span><span class="nx">addTo</span><span class="p">(</span><span class="nx">controller</span><span class="p">);</span>
                        </code>
                    </pre>
                </div>
            </div>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br> 
    </section>           
</div>


# Tada!

In the original code, the last animation is *not* instantiated. The fifth HTML section doesn't have a **scrollMagic** scene associated with it. As soon as we leave the previous scene (i.e. the fourth HTML section) **scrollMagic** implements an animation that ends in a default layout (white background). It does it by removing the styling class.

And that was it. 

# So... What did we learn from this code in order to do something similar?

One thing that the coder must do is to find a proper identification of the HTML elements that will hold the triggers of the animation, and pass that identification to **scrollMagic** as property.

The other thing is to identify the HTML elements that will be changed. They might be different to those holding the trigger value. In the example above, changes were implemented to the **body** tag. Additionally, it is necessary to define how our target elements should change. Those changes might be set as (css) attributes included in our stylesheet under a single css selector (usually classes, but can be other).

A couple of other things worth remembering about **scrollMagic** are *scenes and controllers.*

In **scrollMagic** (and in many other animation and visualization packages) the concept of ***scene*** is commonly used as declaration of the animation events. It contains the trigger and details about the expected animation, such as the HTML elements to be affected when reaching that trigger and the new styling. The **scene** also contains the animation properties (eg. duration).

Once you have identified the scenes, you might want to call the ***controller***. This is actually the executor of the animation. Once the scenes are instantiated, they have to be added to the controller in order to start the animation. Every time a trigger is activated, the **controller** will look for the target elements in the HTML page and will add / replace the styling selectors as defined on the associated **scene**.

> Something to remember... Different coders working on a similar project might define the scenes differently, and sometimes the definition of the scene might depend of what you are allow to do given the limitations of the technology.


## Final remarks

This code worked just fine as first example. However I wonder if there would be things that could have been done differently? Do you have any ideas? Try to think at different ways to code this project!

Ok, this is all for this post! Hope it was helpful. And keep coding!

<script src="{{ site.baseurl }}{% link src/vendor/js/scrollmagic/ScrollMagic.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/posts/2023-09-27-simple-way-to-change-background-color-when-scrolling/2023-09-27-how-to-change-background-color-when-scrolling.js %}"></script>