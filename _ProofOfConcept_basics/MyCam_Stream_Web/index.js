import Send from './classes/send.js?12234';
import {getElement, clickEvent,changeEvent} from './javascript/elements.js';
    /*1 set await (async) every set */
    /*2 ask if this programs not supply open check for bads from my domain*/
    /*3 local storage saving requests*/
    /*4 request with file, cookie  */
    /*5 resize the background image */
document.addEventListener('DOMContentLoaded', () =>  {
    const addressTxt = getElement('address')
            , methodSelect = getElement('method')
            , resultTxt = getElement('result')
            , formId = getElement('form')
            , iframeResultId = getElement('iframeTarget')
            , sendWithSelect = getElement('sendWith')
            , messageTxt = getElement('message')
            , fileArea = getElement('file');
            //sendWithSelect.value = 'ajaxJavascript';    //develop
    messageTxt.value = Send.textAreaReset;
    resultTxt.value = Send.textAreaReset; 
    upStateSend();
    addressTxt.focus();
    changeEvent(methodSelect, () => { upStateSend().isContainsExampleAddress(addressTxt); }); 
    changeEvent(sendWithSelect, () => upStateSend() );
    clickEvent('example', () =>  upStateSend().setExampleAddress(addressTxt) ); //insert example to address bar
    clickEvent('submit', (e) =>  { upStateSend().submit(e ,messageTxt.value); /*add scroll conditions here */ } ); //set message area data for post and put methods
    clickEvent('getAnd', () => { addressTxt.value += (addressTxt.value).includes("?") ? '&' : '?'; addressTxt.focus(); });    //add ? and then & & & for sending address, back the focus
    clickEvent('emptyMessage', () => {resultTxt.value = Send.textAreaReset; iframeResultId.src = '';});    //empty message area
    clickEvent('emptyResult', () => messageTxt.value = Send.textAreaReset);    //empty result area
    function upStateSend(){
        return new Send(formId, resultTxt, iframeResultId)
            .setDataSendWith(methodSelect.value, addressTxt.value, sendWithSelect.value)
            .setMessageUploadFileAreas(messageTxt, fileArea);// file upload activate for post
    }
} );

