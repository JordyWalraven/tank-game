#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

// Constants
const char *ssid = "Daelenbroek";
const char *password = "M3inderS";

int playerId = 0; // keep track of the player id

// Structs
typedef struct
{
  String name;
  int id = -1;
  int health = 200;
  int x;
  int angle = 90;
  int power = 30;
  String selectedShot = "SingleShot";
} Player;

// Globals

Player players[4];
int mapArray[1280];
WebSocketsServer webSocket = WebSocketsServer(80);

void syncMap()
{
  DynamicJsonDocument doc(ESP.getMaxAllocHeap());
  doc["type"] = "syncMap";
  JsonArray mapArray = doc.createNestedArray("map");

  for (int index = 0; index < 1280; index++)
  {
    JsonObject mapObject = mapArray.createNestedObject();
    mapObject["x"] = index * 2.0;
    mapObject["y"] = mapArray[index];
  }

  String json;
  serializeJson(doc, json);
  webSocket.broadcastTXT(json);
}

void putPlayerListInDoc(JsonDocument *doc)
{
  JsonArray playerArray = doc->createNestedArray("players");
  for (int i = 0; i < 4; i++)
  {
    if (players[i].id != -1)
    {
      JsonObject playerObject = playerArray.createNestedObject();
      playerObject["id"] = players[i].id;
      playerObject["x"] = players[i].x;
      playerObject["health"] = players[i].health;
      playerObject["angle"] = players[i].angle;
      playerObject["power"] = players[i].power;
      playerObject["weapon"] = players[i].selectedShot;
      // Serial.printf("Player %d: %s Health: %d, X: %d, Angle: %d, Power: %d,\n", players[i].id, players[i].name.c_str(), players[i].health, players[i].x, players[i].angle, players[i].power);
    }
  }
}

void broadcastMenuInfo()
{
  DynamicJsonDocument doc(192);
  JsonArray nameList = doc.createNestedArray("names");
  for (int i = 0; i < 4; i++)
  {
    nameList.add(players[i].name);
  }

  doc["type"] = "menuInfo";
  String Json;
  serializeJson(doc, Json);
  Serial.println(Json);
  webSocket.broadcastTXT(Json);
}

// Callback function when message received
void onWebSocketEvent(uint8_t id, WStype_t type, uint8_t *payload, size_t length)
{
  switch (type)
  {
  case WStype_DISCONNECTED:
    players[id].name = "";
    broadcastMenuInfo();
    Serial.printf("[%u] Disconnected!\n", id);
    break;
  case WStype_CONNECTED:
  {
    Player newPlayer;
    newPlayer.id = id;
    newPlayer.name = "Anonymous";
    newPlayer.x = random(100, 1900);
    players[id] = newPlayer;
    IPAddress ip = webSocket.remoteIP(id);
    broadcastMenuInfo();
    Serial.printf("[%u] Connection from %s\n", id, ip.toString());
  }
  break;
  case WStype_TEXT:
    DynamicJsonDocument jsonBuffer(20000);
    DeserializationError error = deserializeJson(jsonBuffer, payload);
    if (error)
    {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.c_str());
      return;
    }
    if (jsonBuffer["type"] == "setName")
    {
      players[id].name = jsonBuffer["name"].as<String>();
      broadcastMenuInfo();
    }
    else if (jsonBuffer["type"] == "startGame")
    {
      DynamicJsonDocument doc(ESP.getMaxAllocHeap());
      doc["type"] = "startGame";
      putPlayerListInDoc(&doc);

      for (int index = 0; index < 1280; index++)
      {
        mapArray[index] = sin(index / 100.0) * 100.0 + 700.0;
      }

      JsonArray mapArray = doc.createNestedArray("map");

      for (int index = 0; index < 1280; index++)
      {
        JsonObject mapObject = mapArray.createNestedObject();
        mapObject["x"] = index * 2.0;
        mapObject["y"] = sin(index / 100.0) * 100.0 + 700.0;
      }

      String json;
      serializeJson(doc, json);
      webSocket.broadcastTXT(json);
    }
    // receives x values and how much the y changes [{x:0, y:-20}, {x:1, y:-1}, {x:2, y:-2}]
    else if (jsonBuffer["type"] == "updateMap")
    {
      JsonArray mapValues = jsonBuffer["mapPoints"].as<JsonArray>();
      for (int i = 0; i < mapValues.size(); i++)
      {
        mapArray[jsonBuffer["mapPoints"][i]["x"].as<int>()] = jsonBuffer["mapPoints"][i]["y"].as<int>();
      }
      syncMap();
    }

    else if (jsonBuffer["type"] == "tookDamage")
    {
      DynamicJsonDocument doc(192);
      for (int i = 0; i < 4; i++)
      {
        if (players[i].id == jsonBuffer["id"].as<int>())
        {
          // Serial.printf("Player %d found, Id was: %d\n", players[i].id, jsonBuffer["id"].as<int>());
          players[i].health = players[i].health - jsonBuffer["damage"].as<int>();
        }
      }
      putPlayerListInDoc(&doc);
      String json;
      serializeJson(doc, json);
      webSocket.broadcastTXT(json);
    }
    else if (jsonBuffer["type"] == "requestId")
    {
      DynamicJsonDocument doc(192);
      doc["type"] = "playerId";
      doc["id"] = id;
      String json;
      serializeJson(doc, json);
      webSocket.sendTXT(id, json);
    }
    else if (jsonBuffer["type"] == "playerInput")
    {
      DynamicJsonDocument doc(192);
      if (jsonBuffer["input"] == "shoot")
      {
        doc["type"] = "shootShot";
        doc["shot"]["id"] = id;
        doc["shot"]["x"] = players[id].x;
        doc["shot"]["health"] = players[id].health;
        doc["shot"]["angle"] = players[id].angle;
        doc["shot"]["power"] = players[id].power;
        doc["shot"]["selectedShot"] = players[id].selectedShot;
        String json;
        serializeJson(doc, json);
        webSocket.broadcastTXT(json);
      }
      else if (jsonBuffer["input"] == "moveRight")
      {
        players[id].x += 3;
      }
      else if (jsonBuffer["input"] == "moveLeft")
      {
        players[id].x -= 3;
      }
      else if (jsonBuffer["input"] == "angleRight")
      {
        players[id].angle += 1;
      }
      else if (jsonBuffer["input"] == "angleLeft")
      {
        players[id].angle -= 1;
      }
      else if (jsonBuffer["input"] == "powerUp")
      {
        players[id].power += 1;
      }
      else if (jsonBuffer["input"] == "powerDown")
      {
        players[id].power -= 1;
      }
      DynamicJsonDocument playerSync(768);
      playerSync["type"] = "syncPlayers";
      putPlayerListInDoc(&playerSync);
      String playerSyncjson;
      serializeJson(playerSync, playerSyncjson);
      webSocket.broadcastTXT(playerSyncjson);
    }
  }
}

void connectToWifi()
{
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
}

void setup()
{
  Serial.begin(9600);
  connectToWifi();
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println(ESP.getMaxAllocHeap());
  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);
}

void loop()
{
  webSocket.loop();
}