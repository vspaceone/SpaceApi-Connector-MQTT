# SpaceApi-Connector for MQTT servers
This is intended to be used as a connector between the [SpaceApi-Server](https://github.com/vspaceone/SpaceAPI-Server) and a MQTT server to forward information like space status or sensor data to the SpaceApi.

## Configuration
To run this connector a configuration file needs to be created like this one:

config/default.json
```
{
    "mqtt":{
        "id": "MQTT client name",
        "server": "MQTT server address",
        "user": "MQTT username",
        "password": "MQTT password"
    },
    "spaceapi":{
        "server": "SpaceAPI-Server address",
        "token": "token created by your SpaceAPI-Server",
        "topics": {
            "state": "topic to listen for state changes",
            "temperature": "topic to listen for temperature sensor data",
            "humidity": "topic to listen for humidity sensor data",
            "spaceapi": "topic to listen for spaceapi publication and to publish requests"
        }
    }
}
```

## Messages
This connector expects messages in json format structured like following examples (additional data is ignored).

### Error (all topics)
```
{
    "status":"error",
    "error":"Description"   // When status is "error"
}
```
### Topic "state"
```
{
    "status":"ok",
    "data":{                
        "open":true         // true if open, false otherwise 
    }
}
```
### Topic "temperature" or "humidity"
```
{
    "status":"ok",
    "data":{
        "value":123,
        "unit":"°C or F or %",
        "location":"RoomX"
    }
}
```
### Topic "request"
To request a specific value from spaceapi the request field should 
include the specified spaceapi topic followed by the JSON like (dot notation) value from spaceapi:
```
{
    "status":"ok",
    "data":{                
        "request":"spaceapi/topic.specific.spaceapi.value"
    }
}
```

Example for a response that will be published after the request "spaceapi/topic.state.open":
```
{
    "status":"ok",
    "data":{
        "type":"request",                
        "spaceapi":{
            "request": "spaceapi/topic.state.open",
            "response": true
        }
    }
}
```