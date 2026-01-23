#include "WiFi_Imp.h"
#include <ArduinoJson.h>
#include <ArduinoHttpClient.h>

void print_wifi_status()
{
    Serial.print("SSID: ");
    Serial.println(WiFi.SSID());
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
}

void connect_wifi(const char *ssid, const char *password)
{
    int status = WL_IDLE_STATUS;

    while (status != WL_CONNECTED)
    {
        Serial.print("Attempting to connect to Network named: ");
        Serial.println(ssid);
        status = WiFi.begin(ssid, password);
        delay(5000);
    }

    Serial.println("Connected to WiFi");
    print_wifi_status();
}

bool send_json_data(JsonDocument &doc, HttpClient &client, const char *path)
{
    String json = doc.as<String>();

    client.beginRequest();
    client.post(path);
    client.sendHeader("Content-Type", "application/json");
    client.sendHeader("Content-Length", json.length());
    client.beginBody();
    client.print(json);
    client.endRequest();

    int statusCode = client.responseStatusCode();
    String response = client.responseBody();

    Serial.print("Status code: ");
    Serial.println(statusCode);
    Serial.print("Response: ");
    Serial.println(response);

    return (statusCode > 0);
}
