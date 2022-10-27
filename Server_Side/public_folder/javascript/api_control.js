
//global elements: led, lamp, send_text, send_text_button, reload, send_comment, send_comment_button, documentation

function callStringsGetApi(){
    new AxiosRequest(() => configurations.stringsGetApi())
        .GoodResult( (resultData) => { 
            let str = '';
            try{ resultData.displayText.map( x => { str += ' -' + x; }); } 
            catch(e){ str = '*error load data'; displayedText.className = 'red'; }
            displayedText.textContent = str;
        } )
        .BadResult( (errorMsg) => { displayedText.textContent = '*error load data'; displayedText.className = 'red'; } )
        .Builder();
}

function callCommentsGetApi(){
    new AxiosRequest(() => configurations.commentsGetApi())
        .GoodResult( (resultData) => { 
            let str = '';
            try{ resultData.comments.map( x => { str += '-' + x.replaceAll('<', '&lt;') + "<br>"; }); } 
            catch(e){ str = '*error load data'; comments.className = 'red'; }
            comments.innerHTML = str;
        } )
        .BadResult( (errorMsg) => { comments.textContent = '*error load data'; comments.className = 'red'; } )
        .Builder();
}

finishLoaded(() => {

    callStringsGetApi();

    callCommentsGetApi();

    clickEvent(reload, () => { location.reload(); });
    
    clickEvent(documentation, () => {
        
    });

    clickEvent(send_text_button, () => {
        let str = send_text.value;
        if(str.length > configurations.STRING_MAX_LENGTH) {str = str.substring(0, configurations.STRING_MAX_LENGTH)}
        if(str.trim() === '') return;
        new AxiosRequest(() => configurations.stringApi(str))
                .GoodResult( (resultData) => { 
                    feedbackAreaText('Waiting, message sending...');
                    delayText(send_text_button, send_text, () => { 
                        feedbackAreaTextSuccess('Message is sent');
                        callStringsGetApi();
                    } );
                } )
                .BadResult( (errorMsg) => { feedbackAreaTextAlert('Cant send the string'); } )
                .Builder();
    });
    
    clickEvent(led, () => {
        new AxiosRequest(() => configurations.ledOnOff())
            .GoodResult( (resultData) => { feedbackAreaLight('Waiting, sending the led action'); delayButton(led, () => feedbackAreaLightSuccess('The request sent')); } )
            .BadResult( (errorMsg) => { feedbackAreaLightAlert('Cant send the led action'); } )
            .Builder();
    });
    
    clickEvent(lamp, () => {
        new AxiosRequest(() => configurations.lampOnOff())
            .GoodResult( (resultData) => { feedbackAreaLight('Waiting, sending the lamp action'); delayButton(lamp, () => feedbackAreaLightSuccess('The request sent')); } )
            .BadResult( (errorMsg) => { feedbackAreaLightAlert('Cant send the lamp action'); } )
            .Builder();
    });
    
    clickEvent(send_comment_button, () => {
        let str = send_comment.value;
        if(str.length > configurations.COMMENT_MAX_LENGTH) {str = str.substring(0, configurations.COMMENT_MAX_LENGTH);}
        if(str.trim() === '') return;
        new AxiosRequest(() => configurations.commentPostApi(str))
            .GoodResult( (resultData) => {
                send_comment.value = '';
                feedbackAreaTextSuccess('Comment message is sent, thanks');
                callCommentsGetApi();
            } )
            .BadResult( (errorMsg) => { feedbackAreaTextAlert('Sorry cant send the comment'); } )
            .Builder();
    });


});

