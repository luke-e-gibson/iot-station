#include <Arduino.h>
#include <ArduinoJson.h>

#include "WiFi_Imp.h"
#include "arduino_secrets.h"

JsonDocument doc;
WiFiClient client;
IPAddress server_ip;
int serverPort;

void setup()
{
  Serial.begin(9600);
  client = connect_wifi(SECRET_SSID, SECRET_PASS);
  server_ip = IPAddress(SECRET_SERVER_CONFIG);
  serverPort = 3000;
}

void loop()
{
  doc["temperature"] = random(10, 31);
  doc["humidity"] = random(10, 31);

  if (send_json_data(doc, client, server_ip.toString().c_str(), serverPort))
  {
    if (Serial)
    {
      Serial.print("JSON data sent successfully: ");
      serializeJson(doc, Serial);
      Serial.println();
    }
  }
  else
  {
    if (Serial)
    {
      Serial.println("Failed to send JSON data");
      print_wifi_status();
    }
  }

  delay(20000);
}
