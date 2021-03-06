# Advanced C2 Techniques

Command and Control (C2) is how an adversary maintains control of a
compromised host. 

The majority of intrusions require use of the network for C2 and the
techniques used to evade detection are continuously evolving and
improving.

In our environment our proxies deny all unknown incoming connections, so
an adversary must make a victim system initiate a connection to an
external system they control called a C2 server.

All connections initiated by the victim can be tracked back to a
responsible process on the system and tied to a destination which is or
redirects to the C2 server. 

This gives us three general components involved in C2 traffic:

- **Connection**

- **C2 Server**

- **Process**

Over time, advanced techniques have emerged for the way malware
implements each component.

Here is a table showing several examples of how traditional C2
tradecraft has evolved and become harder to detect:

| |Traditional|Advanced |
|-|-|-|
| Connection Types|Synchronous, Direct|Asynchronous, Indirect|
| Connection Intervals|Short, regular intervals|Longer, irregular intervals|
| Connection Encryption|Unencrypted|Encrypted, Tunneled|
| Connection Protocols|Many different (IRC, HTTP, SSH, ICMP)|Few allowed (DNS, HTTP, HTTPS)|
| Connection Patterns|Unusual behavior, odd/missing values in headers, payload|Closely mimics behavior and characteristics of legitimate traffic|
| C2 Server Count|Single, multipurpose|Multiple with different functions|
| C2 Server Certificates|None or Self-Signed|Valid Signed|
| C2 Server Domains|Newly registered, Direct IP, Dynamic DNS|Reputable domains, 3rd party (webmail, cloud storage, social media), Tor|
| Process Talking|Unapproved, Odd behavior|Legitimate, Approved, Normal behavior|
| Process Executables|File Mapped to Disk|In Memory Only|


This document will review each of these characteristics:

- [Connection Types](#connection-types)
- [Connection Intervals](#connection-intervals)
- [Connection Encryption](#connection-encryption)
- [Connection Protocols](#connection-protocols)
- [Connection Patterns](#connection-patterns)
- [C2 Server Count](#c2-server-count)
- [C2 Server Certificates](#c2-server-certificates)
- [C2 Server Domains](#c2-server-domains)
- [Process Talking](#process-talking)
- [Process Executables](#process-executables)

For each one we'll look at examples of how both traditional and more
advanced C2 implementations operate and can be detected.

## Connection Types

The connection to a C2 server can be synchronous or asynchronous.

| | |
|-|-|
|Synchronous|Steady continuous connection between attacker and victim|
|Asynchronous|Intermittent communications using different intervals|

### Synchronous

This is used for interactive operations but is very noisy on the network
and easier to detect.

![](images/Advanced%20C2%20Techniques/image001.png)


### Asynchronous

With asynchronous C2, shell access is implemented as a client-server
model where the implant checks in via HTTP GET or DNS request for tasks
to execute.

The C2 server then relays tasks to the implant via HTTP Response or DNS
response.

![](images/Advanced%20C2%20Techniques/image002.png)


This blends in with normal HTTP/DNS traffic and is not as easy to detect
as a long, established connection.

The connection to a C2 server can also be direct or indirect.

| | |
|-|-|
|Direct|Victim connects directly with C2 server|
|Indirect|Victim never connects directly with C2 server but uses a proxy or third party|


### Direct

Malware that directly communicates with its C2 server provides more
information and more options for incident responders. 

There are many different tools that can be used to research the servers,
domains, and software being used to control the malware and the traffic
is more easily blocked.

### Indirect

Indirectly communicating with a C2 server requires placing some type of
asset between the victim and the C2 server to obscure the identity and
location of the C2 server as well as circumvent proxy restrictions.

With HTTP/HTTPS there are multiple ways:

| | |
|-|-|
|Domain fronting|Uses the front end servers of CDNs such as Amazon, Google, Microsoft Azure to relay C2 traffic|
|Third Party Services|Uses a third party application or service to relay traffic to/from the C2 server|
|Redirectors|This could be an EC2 micro instance or server at any location whose only job is to pass on traffic it receives to/from C2 server|

With DNS, an implant can indirectly communicate with its C2 server using DNS requests and responses.

| | |
|-|-|
|DNS C2|Hostnames from a domain an attacker controls are passed to various DNS servers to be resolved.  The requests and responses contain C2 traffic.|


## Connection Intervals

Connections to a C2 server can use short intervals or long intervals:

| | |
|-|-|
|Short|Interactive access is calling back less than a minute apart, used for operations that require immediate feedback|
|Long|Much more difficult to detect.  Working hours can be set to only call out during certain hours of the day|

Intervals are determined by an implant's sleep time which can be
configured for long periods to avoid detection tools looking for spikes
of unusual activity.

Higher sleep times mean longer times between check-ins.  A sleep time of
a few seconds or less is considered interactive access since the
commands are executed and results returned quickly.

Connections to a C2 server can use regular intervals or irregular
intervals:

| | |
|-|-|
|Regular|Easier to spot with analytics|
|Irregular|Difficult to detect, blend in with normal user traffic|

An implant can be configured with many settings that control when and
how it checks in with its C2 server.

Jitter time keeps the intervals from alerting on interval patterns while
kill dates and lost limits specify when an implant should exit to avoid
detection.

Advanced C2 will typically use irregular intervals for all
communications to avoid analytics tools, short intervals for interactive
operations, and long intervals for persistence.

## Connection Encryption

Connections to a C2 server can be unencrypted or utilize encryption
and/or tunneling.

| | |
|-|-|
|Unencrypted|Commands are passed in plain text|
|Encrypted|Commands or entire connection is encrypted|
|Tunneled|C2 channels within other C2 channels|           

### Unencrypted

C2 traffic that is not encrypted may reveal the commands that are being
passed to the implant and output:

![](images/Advanced%20C2%20Techniques/image003.png)


### Encrypted

C2 traffic that is encrypted hides the commands and output and makes
analysis more difficult:

![](images/Advanced%20C2%20Techniques/image004.png)


### Tunneled

To prevent multiple systems from calling out to the same infrastructure,
one victim can be chosen as the proxy for other victims on the network.

Using a single channel to control multiple hosts is less noticeable than
having multiple compromised hosts call back to the C2 server using their
own C2 channel.

Below, the attacker (10.0.0.194) uses its C2 channel to the victim
(10.0.0.134) to log into a second victim (10.0.0.100) over SSH:

![](images/Advanced%20C2%20Techniques/image005.png)


On the network, this would appear that .134 is the SSH client, when in
reality the attacker at .194 is the one communicating with the .100 host
via the implant.

There are two types of tunnels:

| | |
|-|-|
|Proxy tunnels|These forward TCP/UDP traffic to the compromised network|
|VPN tunnels|These forward Layer 2 traffic to the compromised network|

#### Proxy Tunnels

There are different types of proxies (HTTP, SOCKS, etc) that an attacker
may use to control multiple hosts using a single C2 connection to
attacker-controlled infrastructure.

Using the victim machine as a man in the middle, the attacking machine
can send TCP and UDP traffic to any host that the victim can reach and
it will appear to originate from the victim.

#### VPN Tunnels

This is just like a user VPN'ing into our network except that an
attacker is not using the Cisco VPN software and is using the victim
machine to access the network instead of DHS's VPN gateway.

A network interface is created on the attacking machine that is bridged
to the victim's network interface which allows the attacking machine to
send and receive Layer 2 traffic to the victim's network.

By doing this, the attacking machine can obtain its own IP address and
interact with the network in the same way that the victim machine does.

## Connection Protocols

Connections to a C2 server can use many different types of protocols. 
Modern C2 tends to utilize legitimate, approved protocols in order to
bypass restrictive firewalls.

Different protocols are more effective in specific environments but here
we'll focus on protocols most likely to be successful in our
environment: DNS, HTTP, and HTTPS.

| | |
|-|-|
|DNS|Blends in with legitimate DNS requests and responses|
|HTTP|Blends in with legitimate browsing and applications|
|HTTPS|Encrypted and blends in with legitimate browsing and applications|

### DNS

C2 using DNS consists of many DNS requests for hostnames belonging to a
domain the attacker controls.

When the attacker's name server receives the request (implant checking
in), it responds with a DNS response message (tasks for the implant).

Here is an implant using different types of record requests to send and
receive C2 data:

![](images/Advanced%20C2%20Techniques/image006.png)


### HTTP

When HTTP is used, C2 commands and output are sent in GET and POST
requests and responses.

This implant is set to make a GET request about every 10 seconds. 
Notice the jitter setting keeps the interval around ten seconds but not
exactly.

![](images/Advanced%20C2%20Techniques/image007.png)


### HTTPS

When HTTPS is used, GET and POST requests and responses are used but are
sent inside an encrypted tunnel.

This implant is initiating an HTTPS connection every 20 seconds.  The
jitter setting ensures the interval is random but stays between 17 to 23
seconds:

![](images/Advanced%20C2%20Techniques/image008.png)


Keep in mind, these data channels can be changed on the fly. 

Cobalt Strike's mode command can change C2 from using HTTP GET and POSTs
to using DNS A records or DNS TXT records, to using HTTPS.  Empire can change an implant's C2 on the fly as well.

Also, multiple post-exploitation tools can pass control of an implant to
another C2 server while at the same time changing the protocol being
used to communicate to it.  

## Connection Patterns

When malicious software communicates to its C2 using unique patterns
such as unusual behavior or odd/missing values in the headers and
payload, signatures can be built to more easily detect this traffic over
the network.

Modern C2 attempts to avoid this by closely mimicking the behavior and
characteristics of legitimate traffic.

Traffic shaping, or modifying the behavior and properties of the packets
being transmitted, is used to emulate normal, legitimate traffic such as
Google analytics, Amazon browsing, and cloud storage services such as
Dropbox.

There are two trends that defenders must be aware of when dealing with
this type of scenario:

- Communication Profiles

- Profiles for Different Functions

### Communication Profiles

Patterns of common applications and traffic are increasingly being
packaged into custom "communication profiles" that help C2 traffic to
appear as normal, approved connections.

These profiles are used to simulate real exchanges such as a word doc
being downloaded from a file storage service or a browser loading
website content.

What looks like a file download could actually be commands for an
implant. 

Similarly, files being downloaded by an implant can also be stretched
out over hundreds of different requests/responses to look like something
else.

### Profiles for Different Functions

Different communication profiles are now being used for different
post-exploitation phases.

If interactive access is detected and it is found to use the same
patterns as the long-term persistence, then the long-term persistence is
more easily found.

However, if the two functions use two completely different patterns and
the interactive access is caught, the persistence may not be detected
and can be used to regain interactive access.

For example:

> If a host is compromised by an advanced actor, interactive access may appear as an HTTPS connection mimicking Amazon browsing while persistence may take the form of a daily DNS request for a seemingly normal domain. Finding one will not necessarily help you find the other.

Keep in mind, like protocols, communication profiles can be changed at any time to change what malicious communications look like over the network. One minute it could look like Amazon browsing, the next it could look like Google analytics.

## C2 Server Count

Traditional C2 implementations frequently utilize the same C2 server for
payloads, operations, and persistence.

This creates several problems for the attacker:

| | |
|-|-|
|Increased Detection|Different functions (operations, persistence, etc.) create the same indicators which increases the likelihood of detection|
|Decreased Resilience|Detecting and blocking the domain/IP used by any one of these functions blocks every function|
|IR Reconnaissance|Discovery of the actual C2 server allows reconnaissance of the attacker's infrastructure and operations|

Advanced C2 solves this problem by using a distributed operations model:

| | |
|-|-|
|Segregating by Function|Multiple servers are used, each with different functions|
|Use of Redirectors|Redirectors are used for resilience and to limit visibility of the actual C2 servers|

### Segregating by Function

C2 is more stealthy and resilient when the C2 servers are segregated by
function:

| | |
|-|-|
|Staging|Hosts the payloads for client-side attacks and initial callbacks|
|Operations|Used for interactive operations, installing persistence, expanding foothold, and performing actions on objectives|
|Long-haul|Maintains long-term access to the victim.  Uses low and slow callbacks such as a single DNS A record request for a different domain once or twice a week. In case a C2 server is burned, or implant fails or is terminated, this is used to regain control of the victim|

For example:


> A compromise may involve a payload request to badsite.com but be controlled by domain fronting C2 via HTTPS to google.com.
> If you verify the payload was downloaded from badsite.com (Staging) and are looking for C2 traffic to badsite.com, you won't find anything.
> If you happen to find the C2 via Google domain fronting (Operations), you still need to find the persistence that has been configured to call out to persistence-site.com (Long-haul).


Also, like protocols and profiles, the C2 server that an implant is
checking into can be changed at any time.

### Use of Redirectors

Redirectors allow attack operations to continue in the event a domain or
redirector is discovered and blocked by Incident Response.

If a redirector gets blocked by IR, other redirectors can be used and
the implants can continue to check in and receive tasks from their C2
servers.

Redirectors also obfuscate the identity and location of the actual C2
servers... this can be domain fronting, third party services, or just a
stand-alone server whose only function is to relay traffic between the
victim and C2 server.

In an advanced C2 infrastructure, implants are provided with multiple
domains and redirectors for calling home, none of which are the actual
C2 servers.

Even if the redirectors are discovered and located, the true location of
the C2 servers remains hidden.

## C2 Server Certificates

Traditional C2 servers that use HTTPS typically don't present an actual
certificate, or if they do it is self-signed.

This has made these types of C2 channels easier to detect as
certificates can be carved out of pcaps and their fields inspected for
missing or bogus values.

An SSL/TLS connection without client and server hello packets is
abnormal and a good indication of C2 traffic:

![](images/Advanced%20C2%20Techniques/image009.png)


SSL/TLS connections where an actual certificate is presented looks more
legitimate but requires further inspection to confirm:

![](images/Advanced%20C2%20Techniques/image010.png)


Exporting and comparing this certificate with a valid one shows it lacks
a chain of trust:

![](images/Advanced%20C2%20Techniques/image011.png)


And has fields with bogus information (issuer, subject):

![](images/Advanced%20C2%20Techniques/image012.png)


Advanced C2 using HTTPS makes detection more difficult by using valid,
signed digital certificates:

![](images/Advanced%20C2%20Techniques/image013.png)


This valid, signed certificate was generated for free in less than one
minute using EFF's [certbot](https://cerbot.eff.org/) utility:

![](images/Advanced%20C2%20Techniques/image014.png)


So finding a certificate with empty fields or fake values is a great
indicator of suspicious traffic, but finding a valid signed certificate
does not necessarily mean it's legitimate either.

## C2 Server Domains

Traditional malware is known to use newly-registered domains and direct
IP addresses when connecting to C2 servers.

Because of this, several strategies are used to detect this type of C2
traffic including proxy categorization, domain reputation checking, and
frequency analysis.

Advanced C2 attempts to get around these detection techniques by using
categorized domains and high-trust domains that are frequently visited
by many users on the network.

| | |
|-|-|
|HTTP/HTTPS|Using a categorized domain to avoid suspicion|
|Domain Fronting|Leveraging CDNs to forward and hide the true destination of traffic|
|Third Party Services|Leveraging popular third party services such as webmail, cloud storage, and social media platforms|

### HTTP/HTTPS

Categorized domains are often allowed through the proxy and contents are
encoded or encrypted to hide C2 commands.

Below is an implant communicating to a server with a valid certificate
signed by Let's Encrypt:

![](images/Advanced%20C2%20Techniques/image015.png)


### Domain Fronting

Front end servers of cloud providers like Amazon, Microsoft, and Google
are used to hide the true destination of the C2 traffic and bypass proxy
restrictions.

Below, an implant relays HTTP requests to an Amazon server
(d0.awsstatic.com/13.32.184.246) which passes all traffic to
d2xx82w00xgkht.cloudfront.net, the cloud distribution of an unknown
domain/server.

![](images/Advanced%20C2%20Techniques/image016.png)


### Third Party Services

By leveraging popular third party services such as webmail, cloud
storage, and social media platforms, traffic to C2 servers blend in with
millions of legitimate HTTPS requests/responses.

This implant is checking in with its C2 server using HTTPS requests to
the Dropbox API.  The C2 server then uses the same API to leave tasks
for the implant and collect the results:

![](images/Advanced%20C2%20Techniques/image017.png)


### Process Talking

In the past, the process responsible for a C2 connection may have been
easily identified by the name of the process, its executable, its
parent, its children, or even its start time.

As whitelisting, code-signing, and reputation services have improved,
there has been a significant shift towards malware using trusted
components to run its malicious code, also known as "living off the
land". 

Where traditional malware might run in its own processes and implement
its own C2, modern malware attempts to blend in with normal activity by
using legitimate programs and functions for execution, lateral movement,
C2, and persistence.

The process "talking" may use the following techniques to evade
detection:

| | |
|-|-|
|Process Selection|Choosing a process that is designed to communicate over the Internet such as a browser or application updater|
|Process Injection|Inject DLL/code into a legitimate, approved processes to bypass application whitelisting and blend in with environment|
|Use of APIs|Built-in Windows APIs can be used to execute commands without starting a new process|
|Process Spoofing|If a new process must be created, its name and parent can be spoofed|

### Process Selection

Incident responders can easily identify a process responsible for C2 if
the process doesn't normally communicate over the Internet---notepad.exe
for example.

Instead of hiding in notepad.exe, lsass.exe, or calc.exe, an advanced
adversary will choose to inject into a browser process or an application
that updates over the network to avoid suspicion.

A process that typically has a long life such as explorer.exe or
svchost.exe is also a common choice.

The Windows Defender process (MSASCuiL.exe) would be beneficial to an
attacker because it starts on logon, runs the duration of the user's
session, and wouldn't raise suspicion using the network.

A quick look at the process's properties with Process Hacker indicates
the image file is verified by Microsoft:

![](images/Advanced%20C2%20Techniques/image018.png)


Process Explorer's VirusTotal option also shows the process checks out
as clean:

![](images/Advanced%20C2%20Techniques/image019.png)


But these tools are referring to the process's executable, MSASCuiL.exe,
as being verified.  And they are correct because that executable has not
been modified. 

However, in this example, somewhere inside the process's memory space is
a Meterpreter DLL that is communicating with its C2 server.

### Process Injection

Implants can use process injection to live inside processes, migrate to
different processes, and execute jobs inside of remote processes.

When malware gets an initial foothold in a process, it may be able to
decrease its chances of getting caught by migrating to a different,
safer process using process injection.

Then various jobs such as port scans, credential dumps, and keylogging
can be conducted by injecting shellcode or a DLL into other processes.

Below, a Meterpreter DLL has been injected into the memory space of the
Windows Defender process:

![](images/Advanced%20C2%20Techniques/image020.png)


It communicates out to its C2 server to get tasks, then executes the
task in the context of the Windows Defender process.

Some tasks will require starting a new process while others can be
accomplished using the Windows API.

### Use of APIs

As host-based tools have increased monitoring of new processes and their
arguments, using Windows APIs to execute commands is a better option for
the adversary.

For example, this command requires starting a new process to resolve an
address:

![](images/Advanced%20C2%20Techniques/image021.png)


![](images/Advanced%20C2%20Techniques/image022.png)


While this .NET API call resolves the address without starting a new
process:

![](images/Advanced%20C2%20Techniques/image023.png)


The Meterpreter agent does the lookup by starting a new process, which
can be tracked back to the MSASCuiL.exe process... but advanced malware
won't make this mistake:

![](images/Advanced%20C2%20Techniques/image024.png)


### Process Spoofing

There are many post-exploitation activities that require starting a new
process in order to complete.

Defenders have been aware of this for some time and commonly check for
process and parent process relationship anomalies---a browser spawning
cmd.exe for example.

Advanced malware has the capability to spoof the name of a spawned
process as well as its parent to bypass tools and analysts searching for
these anomalies.

So an implant injected into iexplore.exe may use spoofing to create a
cmd.exe process named "iexplore.exe" to simulate a new browser tab being
opened.

Or it may choose to start the cmd.exe process while spoofing the parent
as explorer.exe which wouldn't attract as much attention as a cmd.exe
spawned from iexplore.exe.

Considering all of the above, the process talking may in fact be
legitimate but injected, using API calls to avoid suspicion, and
disguising spawned processes that might reveal its presence.

One other indication of process injection is if a process contains an
executable that is not mapped to disk.

## Process Executables

It is normal for all of a process's executables to be mapped to disk
which provides several advantages to defenders.

An executable on disk can be scanned by AV, can be prevented from
running by application whitelisting, or can be easily discovered and
examined by other host-based tools and incident responders.

When an executable file exists only in memory, it is much more difficult
to find and inspect and can bypass several different security controls
on a system.

An implant's executable is frequently found hiding in a process via
Reflective DLL injection.

### Reflective DLL injection

This is when a DLL maps itself into memory instead of being loaded by
LoadLibrary and registered as a loaded DLL for the process. 

Since it's not registered, it doesn't show up in the list of loaded DLLs
for the process.

This allows the implant to run without touching disk and without most OS
tools aware of its presence or location.

Most detection techniques built to address this scenario scan memory and
search for:

- Areas of memory that are not mapped to a module

- Memory areas with read, write, and execute (RWX) permissions

- Files with "MZ" at the beginning of file or other recognizable
    strings at expected offsets such as "This program cannot be run in
    DOS mode"

However, advanced implants can bypass these techniques by:

- Removing RWX permissions to appear as non-executable memory space

- Prepending the executable file with NOPs to deceive tools that check
    for values at specific offsets

- Replacing strings that executable files contain such as "MZ", "This
    program cannot be run in DOS mode", etc.

## Summary

Advanced C2 tradecraft is focused around avoiding traditional detection
techniques and mimicking common, approved services.

- Connections are asynchronous and connect to their C2 servers
    indirectly in irregular intervals

- Encryption and tunneling are used in combination with approved
    protocols to bypass firewall restrictions and avoid detection by
    security tools and IR teams

- C2 servers can be protected by redirectors, domain fronting, or the
    use of third party services to hide their identity and location

- An implant can use a variety of communication profiles that can by
    changed on the fly and use many different hosts and domains to
    ensure resilience against IR actions

- The leveraging of legitimate certificates, legitimate processes, and
    legitimate domains allows an implant to disguise its presence on the
    system as well as how it looks on the network

In the following pcap, a system was compromised by an implant that used
three separate communications profiles to talk to its C2 server---one
for staging, one for operations, and one for persistence.

See if you can identify and explain each one:

    /CSIRT/Sample-Files/CSIRT-pcap-7.pcapng

