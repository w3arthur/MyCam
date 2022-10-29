

export const configurations = {
    apiUrl: 'http://localhost:3777' //'https://arthurcam.com' //
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
};



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