#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsServer.h>

// Constants
const char* ssid = "Daelenbroek";
const char* password = "M3inderS";

// Globals
WebSocketsServer webSocket = WebSocketsServer(80);

// Callback function when message received
void onWebSocketEvent(uint8_t id, WStype_t type, uint8_t * payload, size_t length){
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", id);
      break;
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(id);
        Serial.printf("[%u] Connection from ", id);
        Serial.println(ip.toString());
      }
      break;
    case WStype_TEXT:
      Serial.printf("[%u] Received text: %s\n", id, payload);
      webSocket.sendTXT(id, "I got your text");
      break;
  }
}


void connectToWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
}


void setup() {
  Serial.begin(9600);
  connectToWifi();
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);
}

void loop() {
  webSocket.loop();
  delay(2000);
}