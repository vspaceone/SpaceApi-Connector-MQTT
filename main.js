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
})

client.on('message', function (topic, buf){
    message = JSON.parse(buf)
    console.log(message)

    if (topic == config.get('spaceapi.topics.state') && message.status == 'ok'){      
        sendSpaceapiUpdate({
            state:{
                open: message.data.open,
                lastchange: Date.now()
            }
        })
    }
})