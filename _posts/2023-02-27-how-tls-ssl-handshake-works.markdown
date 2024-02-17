---
layout: post
title:  "How TLS/SSL handshake works (Part 1)"
date:   2023-02-27 12:00:00 +0200
categories: blog series security-and-access
---

<img src="{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/TLS-client2server.png %}" style="width:100%;">

Topics that I still find fascinating are how clever software people have taken care of our security and data governance on Internet applications.

A clear example of a solution to a security problem is the **TLS/SSL protocol**. The details of the protocol are well known and there is plenty of information out there. However, I have always struggled in trying to understand the usual explanations: they are usually either too technical or too shallow for me. And by working as trainer for people new to programming, with a poor technical background, I realized how hard would be for them not to be able to visualize the process.

Therefore, I decided to work on a more visual and playful description. That approach worked better for me, and I hope it could help some of you too.

This is one in a series of posts where I will comment on security and access. My background is mostly Javascript and also Salesforce, so I will emphasize those two, but I will signal other tools as well.

Let's get it started!

### Why do we need a Security Protocol for the Internet?

You might know by now that the Internet is not a secure place. Although the Internet was originally a military-funded project it eventually became an academic one. By that time, the academy defended the public rationale of the Internet as a way to facilitate the divulgation of the scientific researches.

Everything changed when the Internet was make available for a wider public use back in the 80's. By then there was poor progress on data protection. Although the risks of data lekage were very low (no many people knew how to hack it), there were activities that were too risky to do through the Internet. You could set a website, probably a form to get some data was also ok. But what about passwords, credit cards, confidential documents, etc?

And those risks became higher with the professionalization of [crackers](https://testbook.com/gate/difference-between-hackers-and-crackers#:~:text=Hackers%20use%20legal%20tools%20to,illegal%20activities%20and%20compromise%20systems.).

/////
Now, the lying design of the Internet could not be changed - it was to big and already used by too many. So a security protocol on top of the existing design was required in order to extend the use of the network.
////

| Remember that engineers prefer to keep things within protocols |
|-----------------------------------------------------------------|
|Protocols are conventional norms to standardize the engineering designs. That helps to prevent unreconciliable mistmatches when creating new products or services. Just imagine someone making a car that it is wider that every road existing in your country and then think how to overtake it when the traffic goes slow.|

# The TLS/SSL and the TLS/SSL Handshake

TLS is the acronym for **Transport Layer Security** and it is applicable to everything that runs under  **communication protocols**, or protocols that rule the communication between parties, such as HTTP, FTP, TCP/IP, or SMTP protocols.

TLS is a improved protocol intended to replace the **Secure Sockets Layer** protocol, better known as SSL. Although they are not exactly the same, they are also not that different. Both were outlined for a similar purpose and TLS took all the best practices and implementations of the SSL. They were considered synonyms as both were alternative security protocols for long time, but nowadays the SSL protocol is being rapidly faced out after some vulnerabilities were found.

///

We will continue that tradition of keeping those two acronyms together and talk about one sub-protocol that it is described for both: the Handshake protocol. 

Here a note: I can imagine that protocols are one of the most confusing things if you are new to the technical world. In fact, there are protocols and frameworks everywhere.

///

We are going to examinate the **Handshake protocol** from one of its variants: the TLS 1.2 variant. The variant is still widely used, although bear in mind that the newest version of the TLS protocol, version 1.3, considers that variant already outdated.

But we cannot talk about the steps and reasoning of the protocol before explaining who the parties are.

### The Parties

<img src="{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/TLS - parties.png %}" style="width:100%;">

The whole Handshake protocol focus on three participants: the Server, the Client, and the Certificate Authority.

The concept of **Server** might not be that ambiguous for someone without previous technical knowledge: it is easy to relate that to a machine.

The concept of **Client** could be less clear for the initiated, but the whole protocol doesn't give room for doubt: like the Server, the Client is a machine. A program, to be more precise. A program that resides in a computer that would make the first contact with the Server, usually on behalf of someone else, like a user (you, for example).

So both, the Server and the Client are *machine applications designed for the exchange of data on Internet*. The Client is the one who would start that communication because it is looking for a service (eg. data resources) that the Server could provide.

The only actual entity is the **Certificate Authority**. Although we are not going to talk much about the Certificate Authority, keep in mind that it is a fundamental figure for the whole thing to work. The Certificate Authority is a truthworthy organisation that acreditate the legitimacy of other organizations by providing a (virtual) certificate.

<img src="{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/Let’s_Encrypt_example_certificate_on_Firefox_94_screenshot.png %}" style="width:100%;">
(*An example of a Certificate, source: [Wikipedia](https://en.wikipedia.org/wiki/Communication_protocol)*)


Now, keeping in mind that we are talking about machines, let me introduce some of the main charaters of this story: the Client and the Server.

They both want to communicate confidential data through a very public space. It is like shouting the username and password of your email address in a commercial mall a busy Saturday.

///
They must find a way **to agree how they are going to protect their communication without no-one else knowing some critical terms of that agreement**.
///

Sharing those first xxxx is what the Handshake does.

### Handshake Rationale and Steps

The usual diagram of the TLS / SSL Handshake protocol (TLS 1.2) is like the following:

<img src="{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/Full_TLS_1.2_Handshake.png %}" style="width:100%;">
(*source: [Wikipedia](https://en.wikipedia.org/wiki/Communication_protocol)*)


Notice that there are 4 relevant exchanges on that diagram:
1. When the connection is requested
2. The Hellos
3. The Client Key Exchange
4. The first test for data transfer

In this and following posts I will concentrate on steps 2, The Hellos, and 3, the Client Key Exchange. But first, let me introduce the main parties.

The whole point of the story is that our Client wants to communicate with our Server.

However, the Internet is a public space and everyone can access other's messages. 

The TLS / SSL Handshake protocol was an answer to start that communication and exchange the required means to secure the confidentiality of the data. Essentially, it is about:
* that the Client can verify the identity of the corresponding Server and viceversa (**Authentication**),
* that that communication is confidential (**Confidentiality**), and
* that the data transmitted between the parties can not be modified by an external actor without that being known by the concerned users (**Integrity**)

But the protocol can be seen in a different way: 

> It is the protocol that the Client and the Server will use to agree upon the same rules of confidentiality between the both, while preventing others to know the terms of that agreement.

And that is the magic of this process: **it is about how to reach a secret agreement in an already public space**.

### The Hellos

#### Client Hello

To start that communication, our Client sends some information into the public Internet hoping that it will reach the intended Server.

In general, the "letter" sent to the Server is very basic, and of no harm for the concerned parties:

<img src="{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/TLS - clientHELLOrecords.jpg %}" style="width:100%;">

However, even if still publicly accessible, all data is relevant. In particular, the ones that will play an important role later when the confidentiality is implemented are the ciphers and the client random.

That confidentiality will be reached through **encryptation**, which simply put is a way to change the content of the whole message so no-one can understand what the actual message is. However, an encrypted message makes no sense if it can not be de-encrypted by the concerned parties, i.e. the Client and the Server. 

**Ciphers** are encryptation / de-encryptation "machines" (actually, operations). The Client wants the Server to know which machines the Client uses, so it sends a list.

Those ciphers make use of what it is commonly known as **keys** to work properly. They are not literally keys, but numbers with certain properties. 

// The whole purpose of this first exchange is to agree upon the use of a same cipher and same keys without letting others to know the keys. //

The **client random** is part of those keys and consists in a random value that the client produces. In order to use the same keys, the Server must also have a copy of  client random.

So, our Client sends that Hello letter with the client random and waits.

<br/>
<br/>
<img src="{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/TLS - clientHELLO2server airplane.png %}" style="width:100%;">
<br/>
<br/>
<br/>
<br/>
<br/>

#### Server Hello

Let's assume that the "client hello" reaches its destination, which is our certified Server. Now on the desk of our Server are the details of the Client including the client random. It is time for the Server to contact the Client.

<img src="{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/TLS - serverHELLOrecords.png %}" style="width:100%;">

Some of things the Server wants to share with the Client coincide with the "client hello" details. Between other things, the Server also wants to share a list of the used ciphers and a random number, the **server random**.

But first of all, the Server:
* must porve that the Client is talking to the right server, and
* must provide something that helps the client to send back something secret this time

Things that the Server will use are already on the Server desk.

First, the Server would like to prove its identity to the Client through a Certificate Authority.

<div style="text-align:center;"><img src="{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/certificate.png %}" style="width:30%;"></div>

The Client would like to see a copy of that certificate for a first scan of the worthtrusfulness of the Server.

And here is where things start getting fascinating: if the Internet is public, how other people won't know how to get that 

//encryption mechanism when sending that encryption key to the Client?//

The solution is clever: the Server is using **asymetric keys** for encryption. 

<div style="text-align:center;"><img src="{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/asymetrickeys.png %}" style="width:40%;"></div>

There are encryption machines that requires two different keys for the process: when one is used for encryption, the only way to decrypt the same message is by using the other key.

The Server has those two keys. One of those keys can be made **public** and can be used to encrypt messages by whoever wants. While the other one stays **private** and safely guarded, the only entity able to decrypt all those messages will be our Server.

Now the Server is ready to reply to the Client: some similar data to the "client hello", including its own server random, plus a copy of the certificate as well as one of the public key.

<img src="{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/TLS - serverHELLOrecords02.png %}" style="width:100%;">

So, our Server sends backs a Hello letter to the Client and waits.

<img src="{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/TLS - serverHELLO2client airplane.png %}" style="width:100%;">

### The (Pre) Master

#### Pre-Master




#### Master and Symetric Keys

//////////////////////////////////////////////////////////////////////////////////////

DUMPED


