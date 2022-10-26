import Action from './action.js?12234';
import Data from './data.js?12234'; //Data
import {getElement} from '../javascript/elements.js';
export default class Send extends Action{   //Builders Patterns
    #data; #formId; #iframeResultId; #resultId; #example; #sendWith; #isMessageData; #isFileUpload;
    constructor(formId ,resultId, iframeResultId) { 
        super();
        this.#formId = formId;
        this.#resultId = resultId;
        this.#iframeResultId = iframeResultId;
    }
    setDataSendWith(method, address, sendWith){
        this.#isMessageData = false; this.#isFileUpload = false; this.#example = '';
        this.#data = new Data(method, address);
        switch (method){
            case 'post': this.#isMessageData = true; this.#isFileUpload = true; this.#example = 'http://httpbin.org/post'; break;
            case 'get': this.#example = 'http://httpbin.org/get'; break;
            case 'put': this.#isMessageData = true; this.#isFileUpload = true; this.#example = 'http://httpbin.org/put'; break;
            case 'delete': this.#example = 'http://httpbin.org/delete'; break;
        }
        this.#sendWith = (() => {
            switch (sendWith){
                case 'ajaxJquery': return Send.ajaxJquery;
                case 'fetchJavascript': return Send.fetchJavascript;
                case 'formSubmit': return Send.formSubmit;
                case 'axios': return Send.axiosFunction;
            }
        }) ();
        return this;
    }
    setMessageUploadFileAreas(messageTxt, fileArea){
        getElement(messageTxt).disabled = !this.#isMessageData ? true : false;   // set Message area for methods post and put
        getElement(fileArea).disabled = !this.#isFileUpload ? true : false; 
        return this;
    }
    setExampleAddress(addressTxt){
         getElement(addressTxt).value = this.#example; 
    }
    isContainsExampleAddress(addressTxt){   //Change Example Address if Contains
        if(this.#data.address.includes("http://httpbin.org"))
        getElement(addressTxt).value = this.#example;
    }
    submit(e, message){ 
        const iframe = getElement(this.#iframeResultId);
        const result = getElement(this.#resultId);
        result.value = Send.textAreaReset;
        //iframe.src = ''; syncronic issues!!!
        if(this.#sendWith === Send.formSubmit){
            iframe.style.display = 'block';
            result.style.display = 'none';
            Send.formSubmit(this.#formId, this.#data, e, this.#iframeResultId);
            return;
        }
        Send.submitPrevent(e);
        this.#data.message = this.#isMessageData ? message : null;
        iframe.style.display = 'none';
        result.style.display = 'block';
        this.#sendWith(this.#resultId ,this.#data);
    }
    getData(){
        return this.#data; // the returned is json and not object!
        // {method: this.#data.method, address: this.#data.address, message: this.#data.message};
    }
}