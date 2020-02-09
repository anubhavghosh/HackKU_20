'use strict';

const socket = io();

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

//var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
//var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
//console.log("IOS = "+iOS);
/*if(iOS)
{
 console.log("IOS: "+iOS);
 alert("Please use microphone in iPhone keyboard if you want to use Voice Input" );
 location.replace("https://www.apple.com/iphone/");
}*/
/*
if ( (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))||(navigator.userAgent.match(/safari/i)) ) 
{  console.log("Platform Apple: true"); 
   location.assign("https://www.google.com");
   
}*/
/*
var isAndroid = /(android)/i.test(navigator.userAgent);
console.log("android Testing: "+isAndroid);
if(!isAndroid)
{
 location.assign("https://www.gilabs.co.in/");
} */


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
 // outputYou.textContent = "fetching....";    
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

/*function synthVoice(text) {
  const synth = window.speechSynthesis;
  var voices = speechSynthesis.getVoices();
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  utterance.lang = "en-IN";
  utterance.voice = voices[0];    
  utterance.rate = 1;
  synth.speak(utterance);
}*/

socket.on('bot reply', function(replyText) {
  
   responsiveVoice.speak(replyText,"Hindi Female");   
   //synthVoice(replyText);

  if(replyText == '') replyText = '(No answer...)';
  outputBot.textContent = replyText;
});
