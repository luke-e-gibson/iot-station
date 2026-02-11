#include <Arduino.h>
#include <ArduinoJson.h>

#include "WiFi_Imp.h"
#include "DeepSleep_Impl.h"
#include "arduino_secrets.h"

#define SENSOR_BME280
#include "Sensor.h"

JsonDocument doc;
WiFiClient wifi;
HttpClient client(wifi, SECRET_SERVER_ADDRESS, SECRET_SERVER_PORT);

void setup()
{
  Serial.begin(9600);
  connect_wifi(SECRET_SSID, SECRET_PASS);
  init_sensor();
}

void loop()
{
  if (WiFi.status() == WL_CONNECTED)
  {
    doc.clear();
    doc["temperature"] = read_temperature();
    doc["humidity"] = read_humidity();
    doc["device"] = "ESP8266-Bedroom";

    if (send_json_data(doc, client, "/api/weather"))
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
    deepSleep(60);
  }
  else
  {
    connect_wifi(SECRET_SSID, SECRET_PASS);
  }
}
