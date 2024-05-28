---
layout: post
title:  "The TLS/SSL handshake's asymmetric and symmetric encryptions"
date:   2024-05-27 00:00:00 +0200
categories: blog security-and-access
---


<img src="{{site.baseurl}}{% link /mngassets/posts/2024-05-27-the-tls-ssl-handshake-asymmetric-and-symmetric-encryptions/img/TLS-client2server02.png %}" style="width:100%;">


### The Parties

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-the-tls-ssl-handshake-hellos/TLS - parties.png %}" style="width:100%;">

The whole Handshake protocol focus on three participants: the Server, the Client, and the Certificate Authority.

The concept of **Server** might not be that ambiguous for someone without previous technical knowledge; it is easy to relate that to a machine.

The concept of **Client** could be less clear for the initiated, but the whole protocol doesn't give room for doubt: like the Server, the Client is a machine. A program, to be more precise. A program that resides on a computer that would make the first contact with the Server, usually on behalf of someone else, like a user (you, for example).

> So both, the Server and the Client are *machine/software applications*, not people.

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

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-05-27-the-tls-ssl-handshake-asymmetric-and-symmetric-encryptions/img/TLS - client asymmetric encryption.svg %}" style="width:100%;">


So, our Client sends that Hello letter with the client random and waits.


<img src="{{site.baseurl}}{% link /mngassets/posts/2024-05-27-the-tls-ssl-handshake-asymmetric-and-symmetric-encryptions/img/TLS - clientPREMASTER2server airplane.png %}" style="width:100%;">



#### Server Hello

That was the client hello but what happens on the other side? The server also responds with a "hello" letter.

Let's see what it contains:


  <img src="{{site.baseurl}}{% link /mngassets/posts/2024-05-27-the-tls-ssl-handshake-asymmetric-and-symmetric-encryptions/img/TLS - server asymmetric decryption.svg %}" style="width:100%;">



So, our Server sends back a Hello letter to the Client. 

  <img src="{{site.baseurl}}{% link /mngassets/posts/2024-05-27-the-tls-ssl-handshake-asymmetric-and-symmetric-encryptions/img/TLS - server symmetric encryption.svg %}" style="width:100%;">



Immediately after it sends a message indicating that this is all to be shared in the Server Hello, and waits.

<br/>
<br/>
<img src="{{site.baseurl}}{% link /mngassets/posts/2024-05-27-the-tls-ssl-handshake-asymmetric-and-symmetric-encryptions/img/TLS - serverMESSAGE2client airplane.png %}" style="width:100%;">
<br/>
<br/>


# Tada!

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-05-27-the-tls-ssl-handshake-asymmetric-and-symmetric-encryptions/img/TLS - client symmetric decryption.svg %}" style="width:100%;">


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

**Or visit the Ed Harmoush'Sf course**, [Practical Networking course - About -](https://www.practicalnetworking.net/about/)


----

For the rest, I just hope you enjoyed this reading. Meanwhile, happy coding!



