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
            "state": "topic to listen for state changes"
        }
    }
}
```