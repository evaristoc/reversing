---
layout: post
title:  "How TLS/SSL handshake works"
date:   2023-02-27 12:00:00 +0200
categories: blog series security-and-access
---

<img src="{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/TLS-client2server.png %}" style="width:100%;">

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
|They are just norms required to standardize the compatibility of the engineering designs. That helps to prevent unreconciliable mismatches when creating new products. Just imagine someone making a car that it is wider that every road existing in your country and then think how to overtake it when it goes slow.|

That it is what TLS/SSL and the handshake are: they are not implementations but protocols, a standard to be followed for things to work.

We are going to examinate the handshake protocol from one *implementation*, the TLS v1.2 RSA variant. The variant is still one of the most popular, although bear in mind that for the newest version of the TLS protocol, version 1.3, considers that variant already outdated.

### The Parties

So let's introduce our participants: **Client** and **Sever**.

// IMAGES AND SOME COMMENTS ABOUT THEM //

There is a third participant that it is required for this to work: the **Certificate Authority**. Although we are not going to talk much about that participant bear in mind that it is a fundamental figure for the whole thing to work.

// THINK A WAY TO SUGGEST AN INVISIBLE CHARACTER THAT IS VERY IMPORTANT FOR THE STORY //

The whole point of the story is that our Client wants to communicate with our Server.

However, the Internet is a public space and everyone can access other's messages. So how to communicate things like passwords, credit cards, confidential documents, etc without someone being able to see them or modify them?

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

Now let's assume that the "client hello" reaches its destination, which is our certified Server.

<img src="{{site.baseurl}}{% link /mngassets/posts/2023-02-27-how-tls-ssl-handshake-works/TLS - serverHELLOrecords.png %}" style="width:100%;">

Our Server has now the details of the Client including the client random. Now is time for the Server to contact the Client.

Some of things the Server wants to share with the Client coincide with the "client hello" details. Between other things, the Server also wants to share a list of the used ciphers and a random number, the **server random**.

But first of all, the Server:
* must notify that the Client is talking to the right server, and
* must provide for the client to send the last part of the common key, this time in a way that no-one could get its content

Things that the Server will use are already on the Server desk.

First, the Server would like to grant its identity through the Certificate Authority.

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


