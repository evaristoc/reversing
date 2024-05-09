---
layout: post
title:  "The TLS/SSL handshake's hellos"
date:   2024-02-18 00:00:00 +0200
categories: blog security-and-access
---
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/xia/hooks.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/konva/konva.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/quantization/quantization.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/xia/xia_modified.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/git-sha1/git-sha1.min.js %}"></script>
<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/vendor/styles/xia_modified.css %}">


<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-the-tls-ssl-handshake-hellos/TLS-client2server.png %}" style="width:100%;">

# The TLS/SSL and the TLS/SSL Handshake

TLS is the acronym for **Transport Layer Security** and it is applicable to everything that runs under  **communication protocols**, or protocols that rule the communication between parties, such as HTTP, FTP, TCP/IP, or SMTP protocols.

TLS is an improved protocol intended to replace the **Secure Sockets Layer** protocol, better known as SSL. Although they are not exactly the same, they are also not that different. Both were outlined for a similar purpose, and TLS took all the best practices and implementations of the SSL. They were considered synonyms as both were alternative security protocols for a long time, but nowadays the SSL protocol is being rapidly phased out after some vulnerabilities were found.

Both, TLS and SSL, are concerned with the full transmission of data through a secure layer, usually understood as a "tunnel".

But before that tunnel is created, the parties must agree on how the data going through that tunnel should be protected. The challenge is that that agreement has to be reached through an already public channel prone to data interception and monitoring.

> Data exchange on the public Internet is like throwing a piece of paper with your private bank details from one point to another in a shopping mall on a busy Black Friday 

The  **Handshake protocol** is a sub-protocol of he TLS/SSL to formalize that agreement. In other words, it is the protocol where the parties agree upon the same rules of confidentiality between the both, while preventing others to know the terms of that agreement.

We are going to broadly examine the Handshake protocol from one of its variants, the TLS 1.2 version. The 1.2 version is still widely used, although bear in mind that the newest version of the TLS protocol, version 1.3, considers that variant already outdated.

Let's start by describing the main characters.

### The Parties

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-the-tls-ssl-handshake-hellos/TLS - parties.png %}" style="width:100%;">

The whole Handshake protocol focus on three participants: the Server, the Client, and the Certificate Authority.

The concept of **Server** might not be that ambiguous for someone without previous technical knowledge; it is easy to relate that to a machine.

The concept of **Client** could be less clear for the initiated, but the whole protocol doesn't give room for doubt: like the Server, the Client is a machine. A program, to be more precise. A program that resides on a computer that would make the first contact with the Server, usually on behalf of someone else, like a user (you, for example).

> So both, the Server and the Client are *machine/software applications*, not people.

The Client is the one who would start that communication because it is looking for a service (e.g., data resources) that the Server could provide.

The only actual entity is the **Certificate Authority**. Although we are not going to talk much about the Certificate Authority, keep in mind that it is a fundamental figure for the whole thing to work. The Certificate Authority is a truthworthy organization that acreditate the legitimacy of other organizations by providing a virtual certificate.

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-the-tls-ssl-handshake-hellos/Let’s_Encrypt_example_certificate_on_Firefox_94_screenshot.png %}" style="width:100%;">
(*An example of a Certificate, source: [Wikipedia](https://en.wikipedia.org/wiki/Communication_protocol)*)

Now, keeping in mind that we are talking about machines, let's turn our focus on to the steps they have to follow in order to reach data security.

### Handshake Steps

The usual diagram of the TLS / SSL Handshake protocol (TLS 1.2) is like following:

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-the-tls-ssl-handshake-hellos/Full_TLS_1.2_Handshake.png %}" style="width:100%;">
(*source: [Wikipedia](https://en.wikipedia.org/wiki/Communication_protocol)*)


Notice that the diagram shows 4 relevant exchanges:
1. When the connection is requested (the TCP/IP connection)
2. The Hellos
3. The Client Key Exchange
4. The Application Data

The Handshake (TLS 1.2) is better described by the two in the middle: the Hellos and the Client Key Exchange. Let's talk about those two.

### The Hellos

The Hellos of TLS v1.2 contain the terms and pieces required for the eventual data protection mechanism. The interesting part of this exchange is that it is totally public. At this stage, there is no direct harm if the information is visible. The data protection procedure will make use of **two pieces** contained in those messages, but at this point it is not important if someone sees them; they won't work without a **third piece** of information that will be exchanged in a *protected format* at a different step. It is also true that everyone could modify the values, but there will be ways to detect that too.

The Hellos are two:

* The Client Hello
* The Server Hello

#### Client Hello

To start the Handshake, our Client sends some information into the public Internet hoping that it will reach the intended Server.

In general, the "letter" sent to the Server is very basic, and of no harm for the concerned parties:

  <div class="xiawrapper" id="wrapper">
    <section class="xiasidebar" id="sidebar_client">
      <article class="xiadescription" id="description_client" aria-live="polite" tabindex="1"></article>
      <img id="arrow_down" role="button" alt="voir plus bas" src="{{ site.baseurl }}{% link mngassets/posts/2024-02-18-the-tls-ssl-handshake-hellos/arrow_down.png %}" tabindex="2">
      <section id="alert_mouseover" role='alert' aria-label="survol de" aria-live="assertive"></section>
    </section>
    <section role='img' class="xiaimg" id="interactive_image_client" tabindex="3"></section>
    <div class="options">
    </div>
  </div>
  <template id="metadata">
    <table>
      <tbody>
      </tbody>
    </table>
  </template>
  <script src="{{ site.baseurl }}{% link mngassets/posts/2024-02-18-the-tls-ssl-handshake-hellos/datas/dataClient.js %}"></script>
  <script>
    //console.log("scene, details", scene, details);
    var sidebarAppClient = new MyApp({
      'wrapper' : "description_client",
      'header' : "title",
      'content' : "body_text",
      'footer' : "bottom_content",
      'scrolldown_button' : "arrow_down",
      'sidebar' : "sidebar_client",
      'alert_mouseover' : 'alert_mouseover',
    })
    var xiaInstance = new Xia({
      'hooks' : sidebarAppClient,
      'targetID' : "interactive_image_client",
      'scene' : scene,
      'details' : details,
      'colorPersistent' : {'red':0, 'green': 0, 'blue': 0, 'opacity':.9}
    })
  </script>
<br/>
<br/>
<br/>


So, our Client sends that Hello letter with the client random and waits.

<br/>
<br/>
<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-the-tls-ssl-handshake-hellos/TLS - clientHELLO2server airplane.png %}" style="width:100%;">
<br/>
<br/>
<br/>
<br/>
<br/>

#### Server Hello

That was the client hello but what happens on the other side? The server also responds with a "hello" letter.

Let's see what it contains:


  <div class="xiawrapper" id="wrapper">
    <section class="xiasidebar" id="sidebar_server">
      <article class="xiadescription" id="description_server" aria-live="polite" tabindex="1"></article>
      <img id="arrow_down" role="button" alt="voir plus bas" src="{{ site.baseurl }}{% link mngassets/posts/2024-02-18-the-tls-ssl-handshake-hellos/arrow_down.png %}" tabindex="2">
      <section id="alert_mouseover" role='alert' aria-label="survol de" aria-live="assertive"></section>
    </section>
    <section role='img' class="xiaimg" id="interactive_image_server" tabindex="3"></section>
    <div class="options">
    </div>
  </div>
  <template id="metadata">
    <table>
      <tbody>
      </tbody>
    </table>
  </template>
  <script src="{{ site.baseurl }}{% link mngassets/posts/2024-02-18-the-tls-ssl-handshake-hellos/datas/dataServer.js %}"></script>
  <script>
    //console.log("scene, details", scene, details);
    var sidebarAppServer = new MyApp({
      'wrapper' : "description_server",
      'header' : "title",
      'content' : "body_text",
      'footer' : "bottom_content",
      'scrolldown_button' : "arrow_down",
      'sidebar' : "sidebar_server",
      'alert_mouseover' : 'alert_mouseover',
    })
    var xiaInstanceServer = new Xia({
      'hooks' : sidebarAppServer,
      'targetID' : "interactive_image_server",
      'scene' : scene,
      'details' : details,
      'colorPersistent' : {'red':0, 'green': 0, 'blue': 0, 'opacity':.9}
    })
  </script>
<br/>
<br/>
<br/>



So, our Server sends back a Hello letter to the Client. Immediately after it sends a message indicating that this is all to be shared in the Server Hello, and waits.

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-the-tls-ssl-handshake-hellos/TLS - serverHELLO2client airplane.png %}" style="width:100%;">




# Final Remarks

The TLS / SSL handshake is a very fascinating solution to the security on the web. The procedure last just miliseconds, but there are a lot of things going on. That is why this procedure is sometimes difficult to understand.

Here in this post I just focused on a very specific section of the TLS handshake in its more popular version to date. Bear in mind that there is already a new version of the TLS that it is meant to replace the existing one. But this might take a few years from the time of this writing before it is completed faced out.

If you want to know more about the TLS, there is a lot of material you can find online. However, there are two that have impressed me the most:

##### KHAN ACADEMY

An excellent material, with exercises you can do on the fly, and a detailed discussion of the many aspects around the TLS handshake. No many can rival that quality of the material prepared by the Khan Academy team. The material goes beyond the TLS handshake by keeping this topic as a subtitle of Internet Security. Highly recommended.

**Find more at** [Online Data Security in Khan Academy](https://www.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:online-data-security)


##### PRACTICAL NETWORKING

If what you want is to get a deep knowledge of the TLS itself, have a look at the cyphers used in the procedure, and many other details, including the new versions of TLS, you might find Practical Networking channel and courses probably a better choice. 

Practical Networking is a project by Ed Harmoush and it is not only a good youtube channel but also a very good course. Go for this one if you are into nets. Very clear and detailed.

**Find more at** [Practical Networking youtube channel](https://www.youtube.com/@PracticalNetworking)

**Or visit the Ed Harmoush'S course**, [Practical Networking course - About -](https://www.practicalnetworking.net/about/)


----

For the rest, I just hope you enjoyed this reading. Meanwhile, happy coding!



