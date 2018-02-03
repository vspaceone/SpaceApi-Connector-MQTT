var mqtt_id = "SpaceApi-Connector"
var mqtt_server = "192.168.178.123";
var mqtt_user = "";
var mqtt_password = "";

var spaceapi_server = "http://localhost:8080"
var spaceapi_token = "P3cqlyXovqwXx0TVICHSdSHqKHyXOXYrPslpR6fq5dctwug_uWdkiXaQnSz0IHYhDUCLVZUhKJU2utfo2wqpBA"

var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://' + mqtt_server, {
    clientId: mqtt_id,
    username: mqtt_user,
    password: mqtt_password
})

var unirest = require('unirest');

function sendSpaceapiUpdate(api) {
    unirest.post(spaceapi_server + "/spaceapi")
        .headers({'X-Auth-Token': spaceapi_token, 'Content-Type': 'application/json'})
        .send(JSON.stringify(api))
        .end()
}

client.on('connect', function(){
    client.subscribe('vspace/one/state/open')
})

client.on('message', function (topic, buf){
    message = JSON.parse(buf)

    if (topic == 'vspace/one/state/open'){        
        console.log(message)

        sendSpaceapiUpdate({
            state:{
                open: message.data.open,
                lastchange: Date.now()
            }
        })
    }
})