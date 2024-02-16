---
layout: post
title:  "How TLS/SSL handshake works"
date:   2023-02-27 12:00:00 +0200
categories: blog series security-and-access
---

img src="{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/TLS-client2server.png %}"

<div class="title-img"></div>

<div style='width:100%;'></div>
background-image: url("{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/TLS-client2server.png %}");


Topics that I still find fascinating are how clever software people have taken care of our security and data governance on Internet and on the cloud applications.

A clear example of a solution to a security problem is the TLS/SSL protocol. The details of the protocol are well known and there is plenty of information out there. However, I // DESCRIBE AN APPROACH HERE //have always found those explanations hard to understand, especially for those without previous technical backgrounds.

This is one in a series of post where I will be concentrating on security and access. Laer on I will be also using a cloud solution, Salesforce, to provide a cloud application example of how security and access could be handled and configured.

So if you are interested in having a first idea of security and or want to see how that it is generally implemented in other tools such as Salesforce, this might be a good place.

Let's get it started!

# The TLS/SSL handshake

 TLS is the acronym for **Transport Layer Security** and it is applicable to everything that runs under  **communication protocols**, or protocols that rule the communication between parties, such as HTTP, FTP, TCP/IP, or SMTP protocols.
 
 TLS is the improved protocol of the **Secure Sockets Layer**, better known as SSL. Although they are not exactly the same, they are also not that different. Both were outlined for a similar purpose and TLS took all the best practices and implementations of the SSL. They were considered synonyms as both were alternative security protocols for long time, but nowadays the SSL protocol is being rapidly faced out after some vulnerabilities were found.

Still, we will continue that tradition of keeping those two acronyms together and talk about one sub-protocol that it is described for both: the Handshake protocol. 

Here a note: I can imagine that protocols are one of the most confusing things if you are new to the technical world. In fact, there are protocols and frameworks everywhere.

| Remember that engineers want to keep things within a protocol |
|-----------------------------------------------------------------|
|They are just norms required to standardize the compatibility of the engineering designs. That helps to prevent unreconciliable mismatches when creating new products. Just imagine someone making a car that it is wider that every road existing in your country.|

There is a standard to be followed for things to work. And that it is what TLS/SSL and the handshake are: they are not implementations but protocols.

We are going to examinate the handshake protocol from one *implementation*, the TLS v1.2 RSA variant. The variant is still one of the most popular, although bear in mind that for the newest version of the TLS protocol, version 1.3, considers that variant already outdated.

So let's introduce our participants: **Client** and **Sever**.

// IMAGES AND SOME COMMENTS ABOUT THEM //

There is a third participant that it is required for this to work: the **Certificate Authority**. Although we are not going to talk much about that participant bear in mind that it is a fundamental figure for the whole thing to work.

// THINK A WAY TO SUGGEST AN INVISIBLE CHARACTER THAT IS VERY IMPORTANT FOR THE STORY //

The whole point of the story is that Client wants to communicate with Server.

<img src="{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/TLS-client2server.png %}" style="width:100%;">

