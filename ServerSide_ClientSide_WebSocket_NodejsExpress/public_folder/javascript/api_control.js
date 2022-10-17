
//global elements: led, lamp, send_text, send_text_button, reload, send_comment, send_comment_button, documentation

function callStringsGetApi(){
    new AxiosRequest(() => configurations.stringsGetApi())
    .GoodResult( (resultData) => { 
        let str = '';
        try{ resultData.displayText.map( x => { str += ' -' + x; }); } 
        catch(e){ str = '*error load data'; }
        displayedText.textContent = str;
     } )
    .BadResult( (errorMsg) => { displayedText.textContent = '*error load data'} )
    .Builder();
}

function callCommentsGetApi(){
    new AxiosRequest(() => configurations.commentsGetApi())
    .GoodResult( (resultData) => { 
        let str = '';
        try{ resultData.comments.map( x => { str += '-' + x.replaceAll('<', '&lt;') + "<br>"; }); } 
        catch(e){ str = '*error load data'; }
        comments.innerHTML = str;
     } )
    .BadResult( (errorMsg) => { comments.textContent = '*error load data'} )
    .Builder();
}



finishLoaded(() => {
    callStringsGetApi();
    callCommentsGetApi();
    clickEvent(send_text_button, () => {
        let str = send_text.value;
        if(str.length > configurations.STRING_MAX_LENGTH) {str = str.substring(0, configurations.STRING_MAX_LENGTH)}
        if(str.trim() === '') return;
        new AxiosRequest(() => configurations.stringApi(str))
            .GoodResult( (resultData) => { 
                feedbackAreaText('Wait For message sending...');
                delayText(send_text_button, send_text, () => { 
                    feedbackAreaText('Message is sent');
                    callStringsGetApi();
                 } );
             } )
            .BadResult( (errorMsg) => { feedbackAreaText('Cant send the string'); } )
            .Builder();
    });
    
    clickEvent(led, () => {
        new AxiosRequest(() => configurations.ledOnOff())
        .GoodResult( (resultData) => { feedbackAreaLight('Wait for sending the led action'); delayButton(led, () => feedbackAreaLight('The request sent')); } )
        .BadResult( (errorMsg) => { feedbackAreaLight('Cant send the led action'); } )
        .Builder();
    });
    
    clickEvent(lamp, () => {
        new AxiosRequest(() => configurations.lampOnOff())
        .GoodResult( (resultData) => { feedbackAreaLight('Wait for sending the lamp action'); delayButton(lamp, () => feedbackAreaLight('The request sent')); } )
        .BadResult( (errorMsg) => { feedbackAreaLight('Cant send the lamp action'); } )
        .Builder();
    });
    
    clickEvent(send_comment_button, () => {
        let str = send_comment.value;
        if(str.length > configurations.COMMENT_MAX_LENGTH) {str = str.substring(0, configurations.COMMENT_MAX_LENGTH)}
        if(str.trim() === '') return;
        new AxiosRequest(() => configurations.commentPostApi(str))
        .GoodResult( (resultData) => {
            feedbackAreaText('Comment message is sent, thanks');
            callCommentsGetApi();
         } )
        .BadResult( (errorMsg) => { feedbackAreaText('Sorry cant send the comment'); } )
        .Builder();
    });
    
    clickEvent(reload, () => {
    
    });
    
    clickEvent(documentation, () => {
        
    });

});

