'use strict';

const socket = io();

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

if(iOS)
{
 console.log("IOS: "+iOS);
 alert("Please use microphone in iPhone keyboard if you want to use Voice Input" );
 location.replace("https://www.apple.com/iphone/");
}

if ( (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))||(navigator.userAgent.match(/safari/i)) ) 
{  console.log("Platform Apple: true"); 
   location.assign("https://www.google.com");
   
}

var isAndroid = /(android)/i.test(navigator.userAgent);
console.log("android Testing: "+isAndroid);
if(!isAndroid)
{
 location.assign("https://www.gilabs.co.in/");
} 


const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition ||
      window.msSpeechRecognition)();
recognition.lang = 'en-IN';
recognition.interimResults = false;
recognition.maxAlternatives = 1;




document.querySelector('button').addEventListener('click', () => {
  console.log("++Before_recognitionstart");
  recognition.start();
  console.log("++After_recognitionstart");
});



recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
  if(responsiveVoice.isPlaying()) 
  {
        console.log("Cancellation");
        responsiveVoice.cancel();
  }
  
});

recognition.addEventListener('result', (e) => {
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;
  console.log('Text is==>'+text);

  outputYou.textContent = text;
   
  console.log('Confidence: ' + e.results[0][0].confidence);

  socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
      console.log('Recognition stops');
});

recognition.addEventListener('error', (e) => {
  console.log('Error is ==> '+e.error);    
  outputBot.textContent = 'Error: ' + e.error;
});



socket.on('bot reply', function(replyText) {
  
   responsiveVoice.speak(replyText,"UK English Male");   
   

  if(replyText == '') replyText = '(No JSON Parsed...)';
  outputBot.textContent = replyText;
});
