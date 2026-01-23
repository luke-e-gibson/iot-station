#include <Arduino.h>
#include <ArduinoJson.h>

#include "WiFi_Imp.h"
#include "arduino_secrets.h"

JsonDocument doc;
WiFiClient wifi;
HttpClient client(wifi, SECRET_SERVER_ADDRESS, SECRET_SERVER_PORT);

void setup()
{
  Serial.begin(9600);
  connect_wifi(SECRET_SSID, SECRET_PASS);
}

void loop()
{
  doc["temperature"] = random(10, 31);
  doc["humidity"] = random(10, 31);

  if (send_json_data(doc, client, "/weather"))
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

  delay(60000);
}
