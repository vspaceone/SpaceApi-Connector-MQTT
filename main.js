// ##############################
// Requires
// ##############################
var mqtt = require('mqtt')
var unirest = require('unirest');
var config = require('config');

// ##############################
// Functions
// ##############################

function sendSpaceapiUpdate(api) {
    unirest.post(config.get('spaceapi.server') + "/spaceapi")
        .headers({'X-Auth-Token': config.get('spaceapi.token'), 'Content-Type': 'application/json'})
        .send(JSON.stringify(api))
        .end()
}


// ##############################
// "Main"
// ##############################

var client = mqtt.connect('mqtt://' + config.get('mqtt.server'), {
    clientId: config.get('mqtt.id'),
    username: config.get('mqtt.user'),
    password: config.get('mqtt.password')
})

client.on('connect', function(){
    client.subscribe(config.get('spaceapi.topics.state'))
    client.subscribe(config.get('spaceapi.topics.temperature'))
    client.subscribe(config.get('spaceapi.topics.humidity'))

    client.subscribe(config.get('spaceapi.topics.spaceapi'))
})

client.on('message', function (topic, buf){
    message = JSON.parse(buf)
    console.log(message)

    if (message.status != 'ok'){
        console.log("Error message: " + message.error);
        return;
    }

    if (topic == config.get('spaceapi.topics.state')){      
        sendSpaceapiUpdate({
            state:{
                open: message.data.open,
                lastchange: Date.now()
            }
        })
    } else if (topic == config.get('spaceapi.topics.temperature')){      
        sendSpaceapiUpdate({
            sensors:{
                temperature: [{
                    value: message.data.value,
                    unit: message.data.unit,
                    location: message.data.location
                }]
            }
        })
    } else if (topic == config.get('spaceapi.topics.humidity')){      
        sendSpaceapiUpdate({
            sensors:{
                humidity: [{
                    value: message.data.value,
                    unit: message.data.unit,
                    location: message.data.location
                }]
            }
        })
    } else if (topic == config.get('spaceapi.topics.spaceapi') && message.data.type == 'request'){

        unirest.get(config.get('spaceapi.server') + "/spaceapi")
            .end(function (response) {

                if (response.statusType == 2){
                    client.publish(config.get('spaceapi.topics.spaceapi'),JSON.stringify({
                        status:"ok",
                        data:{
                            type: "response",
                            spaceapi:JSON.parse(response.body)
                        }
                    }))
                } else {
                    client.publish(config.get('spaceapi.topics.spaceapi'),JSON.stringify({
                        status:"error",
                        error:"GET on " + config.get('spaceapi.server') + "/spaceapi failed returned code " + response.status
                    }))
                }

                
            })
    }
})