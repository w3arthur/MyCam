import {configurations, colors} from './config/axios.js';
import {clickEvent, finishLoaded, tags} from './config/htmlElements.js';
import {AxiosRequest} from './api/axios.js';
import {feedbackArea, delayButton, delayText} from './api/htmlElements.js';

//global elements: led, lamp, send_text, send_text_button, reload, send_comment, send_comment_button, documentation

    
finishLoaded(() => {//global page event functions
        //onload run events
    feedbackAreaText('');   //reset value
    feedbackAreaLight('');   //reset value
    feedbackAreaIOTText('');   //reset value
    feedbackAreaComment('');   //reset value
    //send_text.focus();
    callStringsGetApi();
    callStringsIOTGetApi();
    callCommentsGetApi();

    clickEvent(tags.reload, () => { location.reload(); });

    clickEvent(tags.documentation, () => {  //to fix
        window.open("https://github.com/w3arthur/ArthurCam.com");
     });

    clickEvent(tags.send_text_button, () => {
        let str = tags.send_text.value;
        if(str.length > configurations.STRING_MAX_LENGTH) {str = str.substring(0, configurations.STRING_MAX_LENGTH)}
        if(str.trim() === '') return;
        new AxiosRequest(() => configurations.stringSendApi(str))
        .GoodResult( (resultData) => { 
            feedbackAreaText('Waiting, message sending...');
            delayText(tags.send_text_button, tags.send_text, () => { 
                feedbackAreaText('Message is sent', colors.success);
                callStringsGetApi();
            } );
        } )
        .BadResult( (errorMsg) => { feedbackAreaText('Cant send the string', colors.fail); } )
        .Builder();
    });

    clickEvent(tags.send_iot_text_button, () => {
        let str = tags.send_iot_text.value;
        if(str.length > configurations.STRING_IOT_MAX_LENGTH) {str = str.substring(0, configurations.STRING_IOT_MAX_LENGTH)}
        if(str.trim() === '') return;
        new AxiosRequest(() => configurations.stringSendIOTApi(str))
        .GoodResult( (resultData) => { 
            feedbackAreaIOTText('Waiting, message sending...');
            delayText(tags.send_iot_text_button, tags.send_iot_text, () => { 
                feedbackAreaIOTText('Message is sent', colors.success);
                callStringsIOTGetApi();
            } );
        } )
        .BadResult( (errorMsg) => { feedbackAreaIOTText('Cant send the string', colors.fail); } )
        .Builder();
    });

    clickEvent(tags.led, () => {
        new AxiosRequest(() => configurations.ledOnOff())
        .GoodResult( (resultData) => { feedbackAreaLight('Waiting, sending the led action'); delayButton(tags.led, () => feedbackAreaLight('The request sent', colors.success)); } )
        .BadResult( (errorMsg) => { feedbackAreaLight('Cant send the led action', colors.fail); } )
        .Builder();
    });

    clickEvent(tags.lamp, () => {
        new AxiosRequest(() => configurations.lampOnOff())
        .GoodResult( (resultData) => { feedbackAreaLight('Waiting, sending the lamp action'); delayButton(tags.lamp, () => feedbackAreaLight('The request sent', colors.success)); } )
        .BadResult( (errorMsg) => { feedbackAreaLight('Cant send the lamp action', colors.fail); } )
        .Builder();
    });

    clickEvent(tags.send_comment_button, () => {
        let str = tags.send_comment.value;
        if(str.length > configurations.COMMENT_MAX_LENGTH) {str = str.substring(0, configurations.COMMENT_MAX_LENGTH);}
        if(str.trim() === '') return;
        new AxiosRequest(() => configurations.commentPostApi(str))
        .GoodResult( (resultData) => {
            tags.send_comment.value = '';
            feedbackAreaComment('Comment message is sent, thanks', colors.success);
            callCommentsGetApi();
        } )
        .BadResult( (errorMsg) => { feedbackAreaComment('Sorry cant send the comment', colors.fail); } )
        .Builder();
    });

});


//LED or Lamp
function feedbackAreaLight(str, color = colors.process){
        feedbackArea(tags.feedbackAreaLight_element ,str, color); 
}

//String Serial TextArea
function feedbackAreaText(str, color = colors.process){ feedbackArea(tags.feedbackAreaText_element ,str, color); }


//Comment Area
function feedbackAreaComment(str, color = colors.process){ feedbackArea(tags.feedbackAreaComment_element ,str, color); }

//String IOT TextArea
function feedbackAreaIOTText(str, color = colors.process){ feedbackArea(tags.feedbackAreaIOTText_element ,str, color); }


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

function callStringsIOTGetApi(){
    new AxiosRequest(() => configurations.stringsIOTGetApi())
        .GoodResult( (resultData) => { 
            let str = '';
            try{ resultData.displayText.map( x => { str += ' -' + x; }); } 
            catch(e){ throw new Error(); }
            tags.displayedIOTText.textContent = str;
        } )
        .BadResult( (errorMsg) => { tags.displayedIOTText.textContent = '*error load data'; tags.displayedIOTText.className = 'red'; } )
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
