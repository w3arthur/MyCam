import {configurations} from './config/axios.js';
import {clickEvent, finishLoaded, tags} from './config/htmlElements.js';
import {AxiosRequest} from './api/axios.js';
import {feedbackArea, delayButton, delayText} from './api/htmlElements.js';

//global elements: led, lamp, send_text, send_text_button, reload, send_comment, send_comment_button, documentation

    
finishLoaded(() => {//global page event functions
        //onload run events
    feedbackAreaText('');   //reset value
    feedbackAreaLight('');   //reset value
    //send_text.focus();
    callStringsGetApi();
    callCommentsGetApi();

    clickEvent(tags.reload, () => { location.reload(); });

    clickEvent(tags.documentation, () => {  });

    clickEvent(tags.send_text_button, () => {
        let str = tags.send_text.value;
        if(str.length > configurations.STRING_MAX_LENGTH) {str = str.substring(0, configurations.STRING_MAX_LENGTH)}
        if(str.trim() === '') return;
        new AxiosRequest(() => configurations.stringApi(str))
        .GoodResult( (resultData) => { 
            feedbackAreaText('Waiting, message sending...');
            delayText(tags.send_text_button, tags.send_text, () => { 
                feedbackAreaTextSuccess('Message is sent');
                callStringsGetApi();
            } );
        } )
        .BadResult( (errorMsg) => { feedbackAreaTextAlert('Cant send the string'); } )
        .Builder();
    });

    clickEvent(tags.led, () => {
        new AxiosRequest(() => configurations.ledOnOff())
        .GoodResult( (resultData) => { feedbackAreaLight('Waiting, sending the led action'); delayButton(tags.led, () => feedbackAreaLightSuccess('The request sent')); } )
        .BadResult( (errorMsg) => { feedbackAreaLightAlert('Cant send the led action'); } )
        .Builder();
    });

    clickEvent(tags.lamp, () => {
        new AxiosRequest(() => configurations.lampOnOff())
        .GoodResult( (resultData) => { feedbackAreaLight('Waiting, sending the lamp action'); delayButton(tags.lamp, () => feedbackAreaLightSuccess('The request sent')); } )
        .BadResult( (errorMsg) => { feedbackAreaLightAlert('Cant send the lamp action'); } )
        .Builder();
    });

    clickEvent(tags.send_comment_button, () => {
        let str = tags.send_comment.value;
        if(str.length > configurations.COMMENT_MAX_LENGTH) {str = str.substring(0, configurations.COMMENT_MAX_LENGTH);}
        if(str.trim() === '') return;
        new AxiosRequest(() => configurations.commentPostApi(str))
        .GoodResult( (resultData) => {
            tags.send_comment.value = '';
            feedbackAreaTextSuccess('Comment message is sent, thanks');
            callCommentsGetApi();
        } )
        .BadResult( (errorMsg) => { feedbackAreaTextAlert('Sorry cant send the comment'); } )
        .Builder();
    });

});





//LED or Lamp
function feedbackAreaLight(str, color = 'blue'){ feedbackArea(tags.feedbackAreaLight_element ,str, color); }
function feedbackAreaLightAlert(str){ feedbackAreaLight(str, 'red'); }
function feedbackAreaLightSuccess(str){ feedbackAreaLight(str, 'green'); }

//String TextArea
function feedbackAreaText(str, color = 'blue'){ feedbackArea(tags.feedbackAreaText_element ,str, color); }
function feedbackAreaTextAlert(str){ feedbackAreaText(str, 'red'); }
function feedbackAreaTextSuccess(str){ feedbackAreaText(str, 'green'); }


function callStringsGetApi(){
    new AxiosRequest(() => configurations.stringsGetApi())
        .GoodResult( (resultData) => { 
            let str = '';
            try{ resultData.displayText.map( x => { str += ' -' + x; }); } 
            catch(e){ throw new Error(); }
            tags.displayedText.textContent = str;
        } )
        .BadResult( (errorMsg) => { tags.displayedText.textContent = '*error load data'; tags.displayedText.className = 'red'; } )
        .Builder();
}

function callCommentsGetApi(){
    new AxiosRequest(() => configurations.commentsGetApi())
        .GoodResult( (resultData) => { 
            let str = '';
            try{ resultData.comments.map( x => { str += '-' + x.replaceAll('<', '&lt;') + "<br>"; }); } 
            catch(e){ throw new Error(); }
            tags.comments.innerHTML = str;
        } )
        .BadResult( (errorMsg) => { tags.comments.textContent = '*error load data'; tags.comments.className = 'red'; } )
        .Builder();
}
