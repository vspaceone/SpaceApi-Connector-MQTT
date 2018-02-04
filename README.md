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
            "humidity": "topic to listen for humidity sensor data"
        }
    }
}
```

## Messages
This connector expects messages in json format with following structure (additional data is ignored):

```
{
    "status":"ok"|"error",
    "error":"Description"   // When status is "error"
    "data":{                // When status is "ok"
        // When topic is about state
        "open":true|false,
        // When topic is about sensor data
        "value":123,
        "unit":"°C",
        "location":"RoomX"
    }
}
```