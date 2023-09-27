---
layout: post
title:  "How to change the background color when scrolling"
date:   2023-09-27 12:00:00 +0200
categories: blog update
---
<link rel="stylesheet" href="{{ site.baseurl }}{% link src/posts/2023-09-27-how-to-change-background-color-when-scrolling/2023-09-27-how-to-change-background-color-when-scrolling.css %}">

# Hello, scrollMagic!

Adding animation when scrolling is one of the most popular animations you can ever find. There are many ways of adding those animations but for quite some time one of the most used tools has been through [scrollMagic](https://scrollmagic.io/).

Here it is a simple example of the use of scrollMagic by someone who has been learning to use it. The code used for this post is based on a work by Yasser Aziz and can be found at 
[codepen](https://codepen.io/yasserius/pen/rNmExLN){:target="_blank"}.

> I advice to open that codepen to see the code

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
    </section>
    <section class="slide" id="second">
        <h3>Second Step: Instantiating the Red Scene</h3>
            <p><strong>scrollMagic</strong> needs an anchor or trigger in the HTML to indicate where the new scene should start and where should end. For some authors, those changes belong to different <strong>scenes</strong>. The author of the code found convenient to separate the triggers of the scenes into HTML sections. There are 4 sections in this code, each section identified with an id ('first', 'second', 'third'  and 'fourth'). Those ids are used to tell <strong>scrollMagic</strong> "Hey, this is the next scene!".</p>
            <p>Our very first change occurs when the id of the HTML section element is equal to <em><strong>third</strong></em> as <span class='highlight'>triggerElement</span> and a class that is added to the ccs file, <strong>green-bg</strong>, as <span class='highlight'>setClassToggle</span>:</p>
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
            <p>Notice that the <strong>scene</strong> is added to the <strong>controller</strong> at the end of the code.</p>     
        <br>
        <br>
        <br> 
    </section>
    <section class="slide" id="third">
        <h3>Third Step: Repeating Code - Instantiating a Green Scene</h3>
            <p>Here it is something interesting. Notice that the approach of the author consisted <em>in instantiating a new scene object for each section</em>.</p>
            <p>To save time, our author just copied and pasted the code to instantiate an new <strong>scene</strong> object but with different attributes - actually, a different class, <span class='highlight'>green-bg</span>.</p>
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
    </section>
    <section class="slide" id="fourth">
        <h3>Fourth Step: The Same: Instantiating a Blue Scene</h3>
            <p>There is one more change before the code ends, this time changing the background to blue. The code is just the same as before except for the <span class='highlight'>triggerElement</span> and the <span class='highlight'>setClassToggle</span>.</p>
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
    </section>           
</div>


# Tada!

The actual code finish on a fifth html section which is not associated to any animation, therefore **scrollMagic** sets the non-existing scene to the default layout.

And that was it. So how all that happened?

In order to make this animation, the author had to provide the code with an indication on when and how the changes should trigger.

*A couple of other things worth remembering about **scrollMagic** are scenes and controllers.*

In **scrollMagic** (and in many other animation and visualization packages) the concept of ***scene*** is commonly used as reference of animation events.

Another concept was the **controller**. This is actually the executor of the animation. Once the scenes are instantiated, they have to be added to the controller in order to start the animation.

**scrollMagic** uses that also the same concept and it is to the coder to define those scenes and how they will change.

> Something to remember... The way the coder decides what the element of the scene are might not be always the same, and sometimes depends of what you are allow to do given the limitations of the technology.


## Final remarks

This code worked just fine as first example but before think on things that could be done differently regarding the code by this author?

Ok, this is all for this post! Hope it was helpful. And keep coding!

<script src="{{ site.baseurl }}{% link src/vendor/js/scrollmagic/ScrollMagic.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/posts/2023-09-27-how-to-change-background-color-when-scrolling/2023-09-27-how-to-change-background-color-when-scrolling.js %}"></script>