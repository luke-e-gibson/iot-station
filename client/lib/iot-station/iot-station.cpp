#include "iot-station.h"
#include <NTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>

#define SECONDS_IN_MINUTE 60
#define NTP_UPDATE_INTERVAL (10 * SECONDS_IN_MINUTE * 1000) // 10 minutes

WiFiUDP ntpUDP;
NTPClient ntpClient(ntpUDP, "pool.ntp.org", 0, NTP_UPDATE_INTERVAL); // Update every 10 minutes

WifiSettings defaultWifiSettings = {
    "your_ssid",
    "your_password"};

IotClientSettings defaultSettings = {
    "your_device_id",
    "your_auth_token",
    "iot.example.com"};

const char *lastErrorMessage = "";

const char *get_error_message()
{
    return lastErrorMessage;
}

void _set_last_error(const char* error) {
    lastErrorMessage = error;
}

bool _is_connected_to_wifi()
{
    return WiFi.status() == WL_CONNECTED;
}

WifiSettings _get_wifi_settings() {
    return defaultWifiSettings;
}

IotClientSettings _get_iot_settings() {
    return defaultSettings;
}

bool _connect_to_wifi(const char *ssid, const char *password)
{
    WiFi.begin(ssid, password);
    int max_attempts = 20;
    int attempt = 0;
    while (WiFi.status() != WL_CONNECTED && attempt < max_attempts)
    {
        delay(500);
        attempt++;
    }
    return WiFi.status() == WL_CONNECTED;
}

bool _ping_iot_test()
{
    if (!_is_connected_to_wifi())
    {
        return false;
    }
    // Ping google.com to test connectivity
    WiFiClient client;
    if (client.connect("www.google.com", 80))
    {
        client.stop();
        return true;
    }
    else
    {
        return false;
    }
}

WiFiClient _create_wifi_client()
{

    WiFiClient wifiClient;
    return wifiClient;
}

bool _connect_to_iot_station(const char *device_id, const char *auth_token)
{
    if (!_is_connected_to_wifi())
    {
        return false;
    }

    if (!_ping_iot_test())
    { // todo: not good test as no google no work
        return false;
    }

    WiFiClient client = _create_wifi_client();

    return true;
}

bool init_iot_station(const IotClientSettings &settings, const WifiSettings &wifiSettings)
{
    defaultSettings = settings;
    defaultWifiSettings = wifiSettings;

    if (!_connect_to_wifi(wifiSettings.ssid, wifiSettings.password))
    {
        lastErrorMessage = "Failed to connect to WiFi";
        return false;
    }

    // Make sure WiFi connections
    int healthPingAttempts = 0;
    const int maxHealthPingAttempts = 5;
    while (healthPingAttempts < maxHealthPingAttempts)
    {
        if (_ping_iot_test())
        {
            break;
        }
        healthPingAttempts++;
        delay(1000);
    }

    if (healthPingAttempts == maxHealthPingAttempts)
    {
        lastErrorMessage = "WiFi connection health check failed";
        return false;
    }

    if (!_connect_to_iot_station(settings.device_id, settings.auth_token))
    {
        lastErrorMessage = "Failed to connect to IoT station";
        return false;
    }

    return true;
}

float get_npt_time()
{
    if(!ntpClient.update()) {
        lastErrorMessage = "Failed to update NTP time";
        return -1;
    }
    
    return static_cast<float>(ntpClient.getEpochTime());
}

bool send_iot_data(IotData &data)
{
    if (!_is_connected_to_wifi())
    {
        _set_last_error("Not connected to WiFi");
        return false;
    }

    WiFiClient client;
    HTTPClient http;

    // Construct the URL
    String url = "http://";
    url += defaultSettings.server_url;
    url += "/weather";

    // Create JSON payload
    DynamicJsonDocument doc(256);
    data.serialize(doc);

    String payload;
    serializeJson(doc, payload);

    // Make HTTP POST request
    http.begin(client, url);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(payload);

    if (httpResponseCode == 201)
    {
        _set_last_error("");
        http.end();
        return true;
    }
    else if (httpResponseCode == 400)
    {
        _set_last_error("Bad Request - Invalid or missing parameters");
        http.end();
        return false;
    }
    else if (httpResponseCode == 500)
    {
        _set_last_error("Internal Server Error - Database or server error");
        http.end();
        return false;
    }
    else if (httpResponseCode > 0)
    {
        String error = "HTTP Error: ";
        error += httpResponseCode;
        _set_last_error(error.c_str());
        http.end();
        return false;
    }
    else
    {
        _set_last_error("Failed to send HTTP request");
        http.end();
        return false;
    }
}


float deep_sleep_iot_client(float sleep_duration) {
    if(sleep_duration <= 0) {
        lastErrorMessage = "Sleep duration must be positive";
        return -1;
    }

    ESP.deepSleep(sleep_duration * 1e6, RF_DEFAULT);
    return sleep_duration;
}