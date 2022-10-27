// event shortcut functions
function getElement(id){
    if(typeof id === 'string') return document.getElementById(id);
    else if(typeof id === 'object') return id;
}
function clickEvent(id, externalFunction ){ 
    if(typeof id == 'string') return getElement(id).addEventListener('click', (e) => { externalFunction(e) } ); 
    else if(typeof id === 'object') return id.addEventListener('click', (e) => { externalFunction(e) } );
}
//function changeEvent(element, externalFunction ){ return getElement(element).addEventListener('change', (e)=>{ externalFunction(e) } ); }

function submitPrevent(e){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); } //only for type="submit" issue

function finishLoaded(callback){ document.addEventListener('DOMContentLoaded', () =>  { callback(); } );}



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
let feedbackAreaLight_element = getElement('feedbackAreaLight');
let feedbackAreaText_element = getElement('feedbackAreaText');
let displayedText = getElement('displayedText');
let comments = getElement('comments');


const configurations = {
    apiUrl: 'http://localhost:3777' //'https://arthurcam.com'
    , videoSrc: 'https://arthurcam.com/tmp/hls/arthur.m3u8'
    , STRING_MAX_LENGTH: 18
    , COMMENT_MAX_LENGTH: 255
    , FEEDBACK_SHOW_FOR_SEC: 90
    , DELAY_SEC: 15
    , RELOAD_PAGE_AFTER_DELAY_SEC: 2
    , ledOnOff: () => Axios('POST', '/api/arduinoSerial/' + 7, {}, {})
    , lampOnOff: () => Axios('POST', '/api/arduinoSerial/' + 2, {}, {})
    , stringApi: (str) => Axios('POST', '/api/arduinoSerial/' + str, {}, {})
    , stringsGetApi: () => Axios('GET', '/api/arduinoSerial/', {}, {})
    , commentPostApi: (str) => Axios('POST', '/api/comments/', {message: str}, {})
    , commentsGetApi: () => Axios('GET', '/api/comments/', {}, {})
    , 
}

finishLoaded(() => { //onload
    feedbackAreaText('');feedbackAreaLight(''); /*send_text.focus();*/
});



//feedback area
function feedbackArea(element ,str, color){
    if(str === '') {    //api delay complete
        element.textContent = '';
        element.style.display = 'none';
    } else {
        element.style.display = 'block';
        element.className = color;
        element.textContent = str;
        setTimeout( () => { feedbackArea(element ,''); }, configurations.FEEDBACK_SHOW_FOR_SEC * 1000);
    };
}
//LED or Lamp
function feedbackAreaLight(str, color = 'blue'){ feedbackArea(feedbackAreaLight_element ,str, color); }
function feedbackAreaLightAlert(str){ feedbackAreaLight(str, 'red'); }
function feedbackAreaLightSuccess(str){ feedbackAreaLight(str, 'green'); }

//String TextArea
function feedbackAreaText(str, color = 'blue'){ feedbackArea(feedbackAreaText_element ,str, color); }
function feedbackAreaTextAlert(str){ feedbackAreaText(str, 'red'); }
function feedbackAreaTextSuccess(str){ feedbackAreaText(str, 'green'); }

//delay functions
//add feedback area to delay
function delayButton(buttonId, callback){
    const buttonElement = getElement(buttonId);
    buttonElement.disabled = true;
    setTimeout( () => {
        buttonElement.disabled = false;
        callback();
        setTimeout( () => { location.reload(); }, configurations.RELOAD_PAGE_AFTER_DELAY_SEC * 1000);
    }, configurations.DELAY_SEC * 1000);
}

function delayText(buttonId, textFieldId, callback){
    const buttonElement = getElement(buttonId);
    const textElement = getElement(textFieldId);
    buttonElement.disabled = true;
    textElement.disabled = true;
    setTimeout( () => {
        buttonElement.disabled = false;
        textElement.disabled = false;
        textElement.value = '';
        callback();
        setTimeout( () => { location.reload(); }, configurations.RELOAD_PAGE_AFTER_DELAY_SEC * 1000);
    }, configurations.DELAY_SEC * 1000);
}


//axios
const axiosFunction = axios.create({
    baseURL: configurations.apiUrl
    , headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Credentials':true}
    //, withCredentials: true
    //, timeout: 1000
});
async function Axios(method, additionUrl, data, additionHeader){
    if(additionHeader === null || additionHeader === '') additionHeader = {}; if(data === null || data === '') data = {};
    try{
        let response = await axiosFunction({
            method: method, url: additionUrl, data: JSON.stringify(data), headers: additionHeader
        });
        console.log('axios success, response:', response);
        return response.data;
    }catch(error){ console.log(':: axios error'); // error.response?.data, error.response?.status', error.response?.headers
        if(!error.response?.data) throw (()=>'no server connection')() ;
        throw error.response?.data;
    }
}
async function axiosRequest(axiosFunction, goodResult, failResult){
    ( async() => {try{
            const result = await axiosFunction();
            if(await result) await goodResult(result); else throw new Error();
        }catch(error){ await failResult(error);}})();
}
class AxiosRequest{
    #axiosFunction; #goodResult; #failResult;
    constructor(axiosFunction) { this.#axiosFunction = axiosFunction; }
    GoodResult = (goodResult) => { this.#goodResult = goodResult; return this; }
    BadResult = (failResult) => { this.#failResult = failResult; return this; }
    Builder = () => {
        if (typeof(this.#axiosFunction) !== 'function' ||  typeof(this.#goodResult) !== 'function' ) {alert('no functions entered inside axios');return;}
        if (typeof(this.#failResult) !== 'function') this.#failResult = () => {return;};
        ( async() => await axiosRequest( () => this.#axiosFunction(), (result) => this.#goodResult(result), (error) => this.#failResult(error) ) )()
    }
}