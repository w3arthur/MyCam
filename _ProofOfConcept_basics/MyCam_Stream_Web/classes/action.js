import {getElement} from '../javascript/elements.js';
export default class Action{ //all static functions, and GRUD functions
    static jsonToUrl(message){return (new URLSearchParams(message)).toString();}
    static submitPrevent(e){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }
    static setResult(resultId, data, status, error){ const result = getElement(resultId); try { result.value = status + data ? JSON.stringify(data, null, 2) : '' + error ; } catch (e) { result.value = status + data + error; } console.log('Result:', {"data": data, "status": status,"error": error}); }
    static textAreaReset = '{\r\n "": "" \r\n}';
    //CRUD functions
    static axiosFunction(resultId, {address, method, message}){ //data//
        axios({
                method: method,
                url: address,
                data: Action.jsonToUrl(message)
            }).then(res => {Action.setResult(resultId, res, '', '');}).catch(error => {Action.setResult(resultId, '', '', error);});
    }
    static fetchJavascript(resultId, {address, method, message}){ //data//
    fetch(
            address, {
            method: method,
            headers: { 'Accept': 'application/json, text/plain,', 'Content-Type':'application/x-www-form-urlencoded'}, //'Content-Type': 'application/json'
            body: message ? Action.jsonToUrl(message) : null, //JSON.stringify(message)//
        })
        .then( response =>  {  if(response.status>=400) return; /*throw*/ return response.text(); }  )
        .then(content => {let res; try{res = JSON.parse(content);} catch{res = content} Action.setResult(resultId, res, '', ''); } )
        .catch((error) => { Action.setResult(resultId, '', '', error);} );
    }
   static ajaxJquery(resultId, {address, method, message}){ //data//
        if (!window.jQuery) return; //trow//
        jQuery.ajax( 
                address, {
                type: method,
                data: message, // $( form ).serializeArray() //.push('{name:value}')//
                success: (data, status, error) => {
                    if(status != 'success'){ Action.setResult(resultId, data, status, error); }
                    else if(data){ Action.setResult(resultId, data, '', '');  }
                }, error: (data, status, error) => { Action.setResult(resultId, data, status, error); },
        }   );
    }
    static formSubmit(formId, {address, method}, e, iframeResultId){ 
        if(method !== 'get' && method !== 'post'){
            Action.submitPrevent(e);
            getElement(iframeResultId).src = ''; //?not works
            alert(`method (${method}) not allowed with (Form Submit)`);
            console.log(`Error, Cant display Form Submit Results inside the iframe for method (${method})`);
            return;
        } 
        console.log('Displayed Form Submit Results inside the iframe');
        getElement(formId).method = method;
        getElement(formId).action = address;
    }
}