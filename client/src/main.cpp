#include <Arduino.h>
#include <ArduinoJson.h>

#include "WiFi_Imp.h"
#include "arduino_secrets.h"

void setup()
{
  // Initialize serial and wait for port to open:
  Serial.begin(9600);
  while (!Serial) { delay(10); } // wait for serial port to connect. Needed for native USB port only
                                 // Delay stop some boards from crashing

  auto client = connect_wifi(SECRET_SSID, SECRET_PASS);

  auto server_ip = IPAddress(SECRET_SERVER_CONFIG);
  auto serverPort = 3000;
  
  // create a JSON document
  auto doc = ArduinoJson::DynamicJsonDocument(1024);
  doc["temperature"] = 24.3;
  doc["humidity"] = 60;


  if (send_json_data(doc, client, server_ip.toString().c_str(), serverPort))
  {
    Serial.println("JSON data sent successfully");
  }
  else
  {
    Serial.println("Failed to send JSON data");
  }
}

void loop()
{
  delay(10000);
} 
