
//global elements: led, lamp, send_text, send_text_button, reload, send_comment, send_comment_button, documentation

//add feedback area to delay
function delayButton(buttonId){
    const buttonElement = getElement(buttonId);
    buttonElement.disabled = true;
    setTimeout( () => {
        buttonElement.disabled = false;
    }, configurations.DELAY_SEC * 1000);
}

function delayText(buttonId, textFieldId){
    const buttonElement = getElement(buttonId);
    const textElement = getElement(textFieldId);
    buttonElement.disabled = true;
    textElement.disabled = true;
    setTimeout( () => {
        buttonElement.disabled = false;
        textElement.disabled = false;
        textElement.value = '';
    }, configurations.DELAY_SEC * 1000);
}

clickEvent(send_text_button, () => {
    let str = send_text.value;
    if(str.length > configurations.STRING_MAX_LENGTH) {str = str.substring(0, configurations.STRING_MAX_LENGTH)}
    if(str.trim() === '') return;
    new AxiosRequest(() => configurations.stringApi(str))
        .GoodResult( (resultData) => { delayText(send_text_button, send_text); } )
        .BadResult( (errorMsg) => {} )
        .Builder();
});

clickEvent(led, () => {
    new AxiosRequest(() => configurations.ledOnOff())
    .GoodResult( (resultData) => { delayButton(led); } )
    .BadResult( (errorMsg) => {} )
    .Builder();
});

clickEvent(lamp, () => {
    new AxiosRequest(() => configurations.lampOnOff())
    .GoodResult( (resultData) => { delayButton(lamp); } )
    .BadResult( (errorMsg) => {} )
    .Builder();
});

clickEvent(send_comment_button, () => {
    let str = send_comment.value;
    if(str.length > configurations.COMMENT_MAX_LENGTH) {str = str.substring(0, configurations.COMMENT_MAX_LENGTH)}
    if(str.trim() === '') return;
    new AxiosRequest(() => configurations.commentApi(str))
    .GoodResult( (resultData) => { } )
    .BadResult( (errorMsg) => {} )
    .Builder();
});

clickEvent(reload, () => {

});

clickEvent(documentation, () => {
    
});