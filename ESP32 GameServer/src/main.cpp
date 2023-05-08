#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>

WebServer server(80);

const char* ssid = "Daelenbroek";
const char* password = "M3inderS";


void connectToWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
}

/*void beginServer() {
  server.on("/", handleRoot);
  server.begin();
  Serial.println("Server started");
}*/

void setup() {
  Serial.begin(9600);
  connectToWifi();
  //beginServer();
}

void loop() {
  server.handleClient();
  delay(2000);
}