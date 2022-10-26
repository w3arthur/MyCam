const config = require('../config');
const {iotArduinoToken, device_id, property_id} = config.arduinoIOT

const IotApi = require('@arduino/arduino-iot-client');
const rp = require('request-promise');

const getToken = async() => { try {
    const response = await rp(iotArduinoToken);
    return response['access_token'];
} catch (error) { console.error("arduino IOT issue, Failed getting an access token: " + error); } }

const getClient = async() => {
    const client = IotApi.ApiClient.instance;
    const oauth2 = client.authentications['oauth2'];
    oauth2.accessToken = await getToken();
    return client;
}

const getDevicesInfo = async() => {
    const client = await getClient();
    const api = new IotApi.DevicesV2Api(client)    
    api.devicesV2List().then(devices => {
        console.log(devices);
    }, error => {
        console.log('arduino IOT issue');
        console.log(error);
    });
}


const setTextMessage = async(strMessage) => {
    const api = new IotApi.PropertiesV2Api(client)
    const property_value = { value: strMessage }; // {PropertyValue} 
    api.propertiesV2Publish(device_id, property_id, property_value).then(function(data) {
      console.log('arduino IOT issue, API called successfully.');     //set with map
    }, function(error) {
        console.error('arduino IOT issue, calling API');
        console.error(error);
    });
}
