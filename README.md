# ArthurCam.com

<p>
This project controls a lamp inside my room, as well as 1 LED and a screen that allow you to write short text (in English). The circuit is connected to a static HTML website.
</p>

<p align="center">
  Here's the link to my project: <a href="https://ArthurCam.com">ArthurCam.com</a><br>
  <img src="https://i.imgur.com/m8ThomE.png" alt="ArthurCam project">
</p>

<h3>Inspiration, "Erez's Camera"</h3>
<p>

Several years ago, I came across a project called "Erez's Camera". The project provided control to turn on and off two lamps in a room through a website. From what I researched, the project used an LPT connection and the website displayed either a JAVA or FLASH application for streaming.<br>
I visited this project from time to time and enjoyed turning the lamps on and off in the room (there was even a message once asking me to turn off the lamps because it was noon and he wanted to sleep 😊.<br>
Link to the message in the <a href="https://www.fresh.co.il/vBulletin/showthread.php?t=330906&highlight">FRESH forum</a>.<br>
<a href="https://web.archive.org/web/20050921232227/http://erez.myftp.org:80/">Link to the project from the archive</a>.
</p>

<h3>Installation, all the physical equipment</h3>
<h4>In practice, the project was divided into 2 projects</h4>
<p>
<ul>
  <li>Working with (COM) SERIAL PORT (as old school used to work).</li>
  <li>Working with IOT (which stands for Internet Of Things, an apparatus to follow).</li>
</ul>
</p>

<h4>The hardware used in this project</h4>
<p>
<ul>
  <li>Arduino Uno</li>
  <li>Arduino MKR WiFi 1010</li>
</ul>
</p>
<p align="center">
  <img src="https://i.imgur.com/BSBjCrF.jpg" alt="The hardware used in this project, Arduino devices">
</p>

<h4>The following cameras were purchased for actual documentation, real-time streaming</h4>
<p>
<ul>
  <li>
    Logitech C922 PRO HD<br>
    The project was implemented initially with this camera.
  </li>
  <li>
    Logitech Brio 4K<br>
    Purchased for my personal use, if the project received a good camera, then I also deserve one
  </li>
  <li>
    Ezviz C3N<br>
    Today, the project is implemented with an IP camera that initially started with a network connection (via Ethernet). Today, it is connected with WIFI. It is a very good camera in relation to its price compared to USB cameras, but it is weaker for its intended use (security).
  </li>
</ul>
</p>
<p align="center">
  <img src="https://i.imgur.com/gWbANAN.jpg" alt="IP Camera">
  <img src="https://i.imgur.com/QuoaMWM.jpg" alt="USB Cameras">
  <br>
  <img src="https://i.imgur.com/OtPDCBt.jpg" alt="IP Camera lenses">
  <img src="https://i.imgur.com/kIjaTsW.jpg" alt="USB Camera, Arduino overview">
</p>
<p>
I needed to attach PRO camera lenses to the IP camera in order to display images of an object placed close to it and to reduce the glare of a lamp.<br>
I used +2 lenses and a UV filter (taking into account that the camera itself has a fish eye lens). And yes, there are purple-colored lenses :D<br>
</p>
<h4>Additional pictures of the development stages</h4>
<p align="center">
  <img src="https://i.imgur.com/mmLEh9f.jpg" alt="Arduino Image1">
  <img src="https://i.imgur.com/Lc4XLnR.jpg" alt="Arduino Image2">
  <img src="https://i.imgur.com/9xuJrbd.jpg" alt="Arduino Image3">
  <img src="https://i.imgur.com/yfVu8se.jpg" alt="Arduino Image4">
  <img src="https://i.imgur.com/jnrdMXz.jpg" alt="Arduino Image5">
  <img src="https://i.imgur.com/boFj94J.jpg" alt="Arduino Image6">
  <img src="https://i.imgur.com/8riDs9e.jpg" alt="Arduino Image7">
  <img src="https://i.imgur.com/KipmqlF.jpg" alt="Arduino Image8">
</p>

<p>
Attempts, trials, and glimpses at my computer screen during learning.<br>
The Serial Port version was the first one developed on the Arduino Uno, and it was the most challenging in terms of programming.<br>
I didn't expect to have to learn so much about the streaming world, and in addition, I only added the IP camera because I wanted some privacy and to distance the Arduino from me 😁<br>
</p>

