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

function handleRequest(topic, message){
    unirest.get(config.get('spaceapi.server') + "/spaceapi")
            .end(function (response) {
                
                if (response.statusType == 2){
                    //console.log(topic + "|2|" + JSON.stringify(message))
                    var requested = message.data.request
                    requested = requested.substring(config.get('spaceapi.topics.spaceapi').length + 1).split(".")


                    //console.log("Request: " + message.data.request.substring(config.get('spaceapi.topics.spaceapi').length));
                    //console.log(requested);

                    var responseData = JSON.parse(response.body);
                    for (var i = 0; i < requested.length; i++){
                        responseData = responseData[requested[i]]
                    }

                    //console.log("Response: " + responseData)

                    client.publish(config.get('spaceapi.topics.spaceapi'),JSON.stringify({
                        status:"ok",
                        data:{
                            request: message.data.request,
                            response: responseData
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
    client.subscribe(config.get('spaceapi.topics.request'))
})

client.on('message', function (ttopic, buf){
    var topic = ttopic;
    message = JSON.parse(buf)
    //console.log(topic + "|1|" + JSON.stringify(message))

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
    } else if (topic == config.get('spaceapi.topics.request') 
                && message.data.request.startsWith(config.get('spaceapi.topics.spaceapi'))){
        handleRequest(topic, message)
    }
        
        
})