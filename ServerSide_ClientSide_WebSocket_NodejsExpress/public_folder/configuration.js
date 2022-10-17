// event shortcut functions
function getElement(id){if(typeof id === 'string') return document.getElementById(id);if(typeof id === 'object') return id;}
function clickEvent(id, externalFunction ){ if(typeof id == 'string') return getElement(id).addEventListener('click', (e)=>{ externalFunction(e) } ); }
function changeEvent(element, externalFunction ){ return getElement(element).addEventListener('change', (e)=>{ externalFunction(e) } ); }

// video stream address
let videoSrc = "https://arthurcam.com/tmp/hls/arthur.m3u8";

// tag ids
let video = getElement('video');
let led = getElement('led');
let lamp = getElement('lamp');
let send_text = getElement('send_text');
let send_text_button = getElement('send_text_button');
let reload = getElement('reload');
let send_comment = getElement('send_comment');
let send_comment_button = getElement('send_comment_button');
let documentation = getElement('documentation');

