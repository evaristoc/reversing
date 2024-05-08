---
layout: post
title:  "How TLS/SSL handshake works (Part 1)"
date:   2024-02-18 00:00:00 +0200
categories: blog security-and-access
---

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-how-tls-ssl-handshake-works/TLS-client2server.png %}" style="width:100%;">

 Something I find fascinating is the many clever software solutions that people have fashioned to protect us from the numerous security threats faced by Internet users.

A clear example of a solution to a security problem is the **TLS/SSL Handshake protocol**. The details of the protocol are well known, and there is plenty of information out there. The process looks simple on paper, but there are plenty of technicalities or even some confusing terms that might catch you unprepared. I have always found the usual explanations rather complex. And because of my experience as a trainer, I can imagine how hard it could be for some people new to programming with no technical background.

Therefore, I decided to make a more visual and playful description of some of the fundamentals of the protocol, hoping to help some of you better navigate through the more complex, complete explanations.

This is the first in a series of posts where I will comment on security and access, mostly focusing on technologies that I feel comfortable with, but not exclusively.

So without further due, let's get it started!

### Why do we need a Security Protocol for the Internet?

You might know by now that the Internet is not a secure place.

Although the Internet was originally a military-funded project, it eventually became an academic one and was only available to a few selected groups of people concentrated in just one country (the USA). By that time, there was no concern over the confidentiality of the network, as the main purpose of the network was the divulgation of scientific research.

However, the restricted use of the network was about to change. Around the 1980's the newborn Internet was ready for international expansion, making more difficult to identify the users and their purposes. Similarly, people were ready to exploit the economic potential of the network and more commercial players, such as the ISP's (Internet Service Providers), were allowed to connect.

That made confidentiality paramount. Furthermore, it was later discovered that on the public Internet, people could do things like highjack others' identities or intercept and modify the content of the exchanged data, so verifying the identity of the parties as well as finding mechanisms to detect data corruption became important.

The design principles of the Internet network were not founded on any specific shape, but it was (and still is) flexible enough to allow new "features". However, every new feature should be the result of an agreement between all the Internet caretakers, and that agreement should be normalized in the form of **protocols**.

And that also applied to any add-on to the Internet ecosystem meant for data protection. At the end of the 1980's the first draft of the security protocol was outlined. The objectives of the resulting protocol have been left to three:

* **Authentication** - *Allow the parties to verify that they are who they said they are*. This is why when you connect to your Internet bank account you could be sure that you are connecting to the intended bank, and not to a fake one.
* **Confidentiality** - *Prevent the communication between those parties to be read or understood by others*. Once the identity of your bank has been verified, the communications between your bank and you will be made unreadable for external actors, and
* **Integrity** - *The data transmitted between the parties can not be modified by an external actor without being noticed by the concerned users*. So any modification to the exchanged messages with your bank will get noticed, allowing the parties to take further steps that won't put the legitimate transation at risk.

Now, it is key to understand that the basic architecture of the expanded Internet is still the same: every new network added to the existing Internet is barebone and of public nature. Specifically, when it comes to a secure connection, implementing the corresponding protocols is the best known guarantee for data security, and it is up to the concerned parties to implement those protocols.

Keep in mind that *security* is not necessarily *safety* (eg. viruses), but they might come hand by hand in the majority of the cases.

| Remember that engineers prefer to keep things within protocols |
|-----------------------------------------------------------------|
|Protocols are conventional norms to standardize the engineering designs. That helps to prevent unreconciliable mistmatches when creating new products or services. Just imagine someone making a car that it is wider than every road existing in your country, and then think how to overtake it when the traffic goes slow.|

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

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-how-tls-ssl-handshake-works/TLS - parties.png %}" style="width:100%;">

The whole Handshake protocol focus on three participants: the Server, the Client, and the Certificate Authority.

The concept of **Server** might not be that ambiguous for someone without previous technical knowledge; it is easy to relate that to a machine.

The concept of **Client** could be less clear for the initiated, but the whole protocol doesn't give room for doubt: like the Server, the Client is a machine. A program, to be more precise. A program that resides on a computer that would make the first contact with the Server, usually on behalf of someone else, like a user (you, for example).

> So both, the Server and the Client are *machine/software applications*, not people.

The Client is the one who would start that communication because it is looking for a service (e.g., data resources) that the Server could provide.

The only actual entity is the **Certificate Authority**. Although we are not going to talk much about the Certificate Authority, keep in mind that it is a fundamental figure for the whole thing to work. The Certificate Authority is a truthworthy organization that acreditate the legitimacy of other organizations by providing a virtual certificate.

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-how-tls-ssl-handshake-works/Let’s_Encrypt_example_certificate_on_Firefox_94_screenshot.png %}" style="width:100%;">
(*An example of a Certificate, source: [Wikipedia](https://en.wikipedia.org/wiki/Communication_protocol)*)

Now, keeping in mind that we are talking about machines, let's turn our focus on to the steps they have to follow in order to reach data security.

### Handshake Steps

The usual diagram of the TLS / SSL Handshake protocol (TLS 1.2) is like following:

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-how-tls-ssl-handshake-works/Full_TLS_1.2_Handshake.png %}" style="width:100%;">
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

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-how-tls-ssl-handshake-works/TLS - clientHELLOrecords.jpg %}" style="width:100%;">

However, even if it is still publicly accessible, all the data is relevant. In particular, the ones that will play an important role later to ensure confidentiality are the ciphers and the client random.

That confidentiality will be reached through **encryption**, which is a way to change the content of the whole message so no-one can understand what the actual message is. However, an encrypted message makes no sense if it can not be de-encrypted by the concerned parties, i.e., the Client and the Server. 

**Ciphers** are encryption / de-encryption "machines" (actually, operations). The Client wants the Server to know which machines the Client uses, so it sends a list.

Those ciphers make use of what is commonly known as **keys** to work properly. They are not literally keys, but numbers with certain properties.

The **client random** is part of those keys and consists of a random value that the client produces. In order to use the same keys, the Server must also have a copy of the client random.

So, our Client sends that Hello letter with the client random and waits.

<br/>
<br/>
<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-how-tls-ssl-handshake-works/TLS - clientHELLO2server airplane.png %}" style="width:100%;">
<br/>
<br/>
<br/>
<br/>
<br/>

#### Server Hello

Let's assume that the "client hello" reaches its destination, which is our certified Server. Now on the desk of our Server are the details of the Client including the client random. It is time for the Server to contact the Client.

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-how-tls-ssl-handshake-works/TLS - serverHELLOrecords.png %}" style="width:100%;">

Some of things the Server wants to share with the Client coincide with the "client hello" details. Between other things, the Server also wants to share a list of the used ciphers as well as a random number, the **server random**.

But first of all, the Server:
* must prove the Server identity to the Client, and
* must provide something that helps the Client to send back something secret next time

To prove its identity to the Client, the Server will rely on the *Certificate Authority*. Yes, the other party we haven't mentioned that much is now becoming relevant by proving that the Server is who it is.

<div style="text-align:center;"><img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-how-tls-ssl-handshake-works/certificate.png %}" style="width:30%;"></div>

The Client would like to see a copy of that certificate for a first scan of the truthworthiness of the Server.

> In the typical configuration, it is only the Server who has to authenticate during the TLS/SSL procedure.

Now, if it is the right Server, the Client would like to send the third and last piece of information required to create a common mechanism of data protection. 

The first two pieces that the Server and the Client require for further data protection and that will be publicly shared are the **client - and the server random**. The last missing piece should be made unaccessible to external observers, even if it should be sent *through the same public space*. The solution to this challenge is a clever one: the Server will use **asymetric keys** for encryption/decryption. 

<div style="text-align:center;"><img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-how-tls-ssl-handshake-works/asymetrickeys.png %}" style="width:40%;"></div>

There are encryption machines that require two different keys for the process; when one is used for encryption, the only way to decrypt the same message is *by using the other key*.

The Server has a pair of that kind of keys. One of those keys can be copied, made **public**, and used to encrypt messages by whoever wants. Meanwhile, the other one stays **private**, safely guarded by the Server. In that way, the only entity able to decrypt all those messages will be our Server.

Now the Server is ready to reply to the Client. The Server prepares some similar data to the "client hello", including its own server random, plus a copy of the certificate as well as one copy of a *public key*.

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-how-tls-ssl-handshake-works/TLS - serverHELLOrecords02.png %}" style="width:100%;">

So, our Server sends back a Hello letter to the Client. Immediately after it sends a message indicating that this is all to be shared in the Server Hello, and waits.

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-02-18-how-tls-ssl-handshake-works/TLS - serverHELLO2client airplane.png %}" style="width:100%;">



# What have we learned so far?

So far, we have learned the importance of data security protocols on the Internet.

We have also learned how protocols describe the implementation of "features" on top of the Internet network, and that one of those protocols is the TLS/SSL one, which is also composed of another protocol called Handshake.

We have been so far focused on the TLS 1.2 protocol. We had a first overview of the Hellos which are the first steps of the communication between the Client and the Server where, among other things, they start exchanging some information that will help them implement a common data protection mechanism. We also learned about the importance of the Certificate Authority to guarantee the eventual authentication of at least one of those parties.

Another thing to notice is that the exchange is still *public*; so far, the content of the data is still available and modifiable by an external party. However, we were left with a first solution to protect access to the content of our data: asymetric keys.

In a future post, we will discuss why asymetric keys are not the best solution for encrypting all communications and why the Client and the Server are finding a way to create a different kind of encryption mechanism, one based on **symetric keys**. We will also discuss the usual mechanism to check if the data was at some point modified (the standing objective of the protocol to protect **data integrity**).

We will go through that solution on another post. Meanwhile, happy coding!



