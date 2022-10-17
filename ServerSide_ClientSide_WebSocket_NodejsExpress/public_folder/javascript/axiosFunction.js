const axiosFunction = axios.create({
    baseURL: configurations.apiUrl   //'http://localhost:3500'
    , headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Credentials':true}
    //, withCredentials: true
    //, timeout: 1000
});

async function Axios(method, additionUrl, data, additionHeader){
    if(additionHeader === null || additionHeader === '') additionHeader = {};
    if(data === null || data === '') data = {};
    try{
        let response = await axiosFunction({
            method: method, url: additionUrl, data: JSON.stringify(data), headers: additionHeader
        });
        console.log('axios success, response:', response);
        return response.data;
    }catch(error){
        console.log(':: axios error'); // error.response?.data, error.response?.status', error.response?.headers
        if(!error.response?.data) throw (()=>'no server connection')() ;
        throw error.response?.data;
    }
}

async function axiosRequest(axiosFunction, goodResult, failResult){
    ( async() => {
        try{
            const result = await axiosFunction();
            if(await result) await goodResult(result)
            else throw new Error();
        }catch(error){ /*await failResult(error);*/} //please fix, return data from the server
    })();
}

class AxiosRequest{
    #axiosFunction; #goodResult; #failResult;
    constructor(axiosFunction) { this.#axiosFunction = axiosFunction; }
    GoodResult = (goodResult) => { this.#goodResult = goodResult; return this; }
    BadResult = (failResult) => { this.#failResult = failResult; return this; }
    Builder = () => {
        if (typeof(this.#axiosFunction) !== 'function' ||  typeof(this.#goodResult) !== 'function' ) {alert('no functions entered inside axios');return;}
        if (typeof(this.#failResult) !== 'function') this.#failResult = () => {return;};
        (async() =>
            await axiosRequest( 
                () => this.#axiosFunction()
                , (result) => this.#goodResult(result)
                , (error) => this.#failResult(error)
            )
        )()
    }
}