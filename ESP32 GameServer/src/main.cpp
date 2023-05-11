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
  String weapon;
} Player;

// Globals

Player players[4];
WebSocketsServer webSocket = WebSocketsServer(80);

void putPlayerListInDoc(JsonDocument *doc)
{
  JsonArray playerArray = doc->createNestedArray("players");
  for (int i = 0; i < 4; i++)
  {
    JsonObject playerObject = playerArray.createNestedObject();
    playerObject["id"] = players[i].id;
    playerObject["x"] = players[i].x;
    playerObject["health"] = players[i].health;
    playerObject["angle"] = players[i].angle;
    playerObject["power"] = players[i].power;
    playerObject["weapon"] = players[i].weapon;
    Serial.printf("Player %d: %s Health: %d, X: %d, Angle: %d, Power: %d,\n", players[i].id, players[i].name.c_str(), players[i].health, players[i].x, players[i].angle, players[i].power);
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

void broadcastShotInfo()
{
}

void broadcastPlayerInfo()
{
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
    Serial.printf("[%u] Connection from ", id);
    Serial.println(ip.toString());
  }
  break;
  case WStype_TEXT:
    StaticJsonDocument<192> jsonBuffer;
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

      JsonArray mapArray = doc.createNestedArray("map");

      for (int index = 0; index < 2560; index++)
      {
        JsonObject mapObject = mapArray.createNestedObject();
        mapObject["x"] = index;
        mapObject["y"] = sin(index / 100.0) * 100.0 + 700.0;
      }

      String json;
      serializeJson(doc, json);
      webSocket.broadcastTXT(json);
    }

    else if (jsonBuffer["type"] == "tookDamage")
    {
      DynamicJsonDocument doc(192);
      for (int i = 0; i < 4; i++)
      {
        if (players[i].id == jsonBuffer["id"].as<int>())
        {
          Serial.printf("Player %d found, Id was: %d\n", players[i].id, jsonBuffer["id"].as<int>());
          players[i].health = players[i].health - jsonBuffer["damage"].as<int>();
        }
      }
      putPlayerListInDoc(&doc);
      String json;
      serializeJson(doc, json);
      webSocket.broadcastTXT(json);
    }
    else if (jsonBuffer["type"] == "playerInput")
    {
      DynamicJsonDocument doc(192);
      if (jsonBuffer["message"] == "tookShot")
      {
        doc["type"] = "tookShot";
        doc["id"] = jsonBuffer["id"].as<int>();
        String json;
        serializeJson(doc, json);
        webSocket.broadcastTXT(json);
      }
      else if (jsonBuffer["type"] == "moveRight")
      {
        players[jsonBuffer["id"].as<int>()].x += 3;
      }
      else if (jsonBuffer["type"] == "moveLeft")
      {
        players[jsonBuffer["id"].as<int>()].x -= 3;
      }
      else if (jsonBuffer["type"] == "angleRight")
      {
        players[jsonBuffer["id"].as<int>()].angle += 3;
      }
      else if (jsonBuffer["type"] == "angleLeft")
      {
        players[jsonBuffer["id"].as<int>()].angle -= 3;
      }
      else if (jsonBuffer["type"] == "powerUp")
      {
        players[jsonBuffer["id"].as<int>()].power += 3;
      }
      else if (jsonBuffer["type"] == "powerDown")
      {
        players[jsonBuffer["id"].as<int>()].power -= 3;
      }
      DynamicJsonDocument playerSync(192);
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

  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);
}

void loop()
{
  webSocket.loop();
}