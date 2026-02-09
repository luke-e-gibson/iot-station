#include "WiFi_Imp.h"
#include <ArduinoJson.h>
#include <ArduinoHttpClient.h>

void print_wifi_status()
{
    if (Serial)
    {
        Serial.print("SSID: ");
        Serial.println(WiFi.SSID());
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
    }
}

void connect_wifi(const char *ssid, const char *password)
{
#if defined(ARDUINO_ARCH_SAMD) || defined(ARDUINO_ARCH_RP2040)
    if (WiFi.status() == WL_NO_MODULE)
    {
        if (Serial)
        {
            Serial.println("Communication with WiFiNINA module failed!");
        }
        while (true)
        {
            delay(100);
        }
    }
#endif

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print("Attempting to connect to Network named: ");
        Serial.println(ssid);
        delay(1000);
    }

    Serial.println("Connected to WiFi");
    print_wifi_status();
}

bool send_json_data(JsonDocument &doc, HttpClient &client, const char *path)
{
    client.beginRequest();
    client.post(path);
    client.sendHeader("Content-Type", "application/json");
    client.sendHeader("Content-Length", measureJson(doc));
    client.beginBody();
    serializeJson(doc, client);
    client.endRequest();

    int statusCode = client.responseStatusCode();

    if (Serial)
    {
        String response = client.responseBody();

        Serial.print("Status code: ");
        Serial.println(statusCode);
        Serial.print("Response: ");
        Serial.println(response);
    }

    return (statusCode >= 200 && statusCode < 300);
}
