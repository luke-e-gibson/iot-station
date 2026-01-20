#include "iot-station.h"
#include <ESP8266WiFi.h>

bool hasWifi = false;

bool connect_to_wifi(const char* ssid, const char* password) {
    WiFi.begin(ssid, password);
    int max_attempts = 20;
    int attempt = 0;
    while (WiFi.status() != WL_CONNECTED && attempt < max_attempts) {
        delay(500);
        attempt++;
    }
    return WiFi.status() == WL_CONNECTED;
}

bool is_connected_to_wifi() {
    return WiFi.status() == WL_CONNECTED;
}

bool ping_iot_test() {
    if(!is_connected_to_wifi()) {
        return false;
    }
    // Ping google.com to test connectivity
    WiFiClient client;
    if (client.connect("www.google.com", 80)) {
        client.stop();
        return true;
    } else {
        return false;
    }

}

bool connect_to_iot_station(const char* device_id, const char* auth_token) {
    if (!hasWifi) {
        return false;
    }
    
    if(!ping_iot_test()) { //todo: not good test as no google no work
        return false;
    }

    return true; 
}