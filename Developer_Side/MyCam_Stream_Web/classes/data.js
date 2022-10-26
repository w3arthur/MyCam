
  //Class:    // Constructor, Set, Get (Extends, Static and Builder patterns)
export default class Data{
    #message = {}; /*#address; #method;*/
    /*set address(address){ this.#address = address.trim(); }
    get address(){ return this.#address; }
    set method(method){ this.#method = method; }
    get method(){ return this.#method; }*/
    set message(message){ try{ this.#message = JSON.parse(message); } catch{ alert('Cant turn the message to JSON !'); } }
    get message(){ return this.#message; }
    constructor(method, address) { this.method = method; this.address = address.trim(); }
}


/*
//Constructor Function  //Only Constructor and Get
export default function Data(method, address){
    function setMessage(message){ try{ this.message = JSON.parse(message); } catch{ alert('Cant turn the message to JSON !'); }}
    this.method = method;
    this.address = address.trim();
    this.setMessage  = setMessage;
}
*/

/*
//Factory Function  //Only Constructor and Get
export default function data(method, address){
    function setMessage(message){ try{ this.message = JSON.parse(message); } catch{ alert('Cant turn the message to JSON !'); }}
    return {
        method,
        address : address.trim(),
        setMessage,
    }
}
*/







    

