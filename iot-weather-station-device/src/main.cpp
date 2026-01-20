#include <Arduino.h>
#include <iot-station.h> 

#define WIFI_SSID "SuperSecretIOTNetwork"
#define WIFI_PASSWORD "Password1!-1"

#define DEVICE_ID "your_device_id"
#define AUTH_TOKEN "your_auth_token"

void setup() {
  Serial.begin(115200);
  
  if(!connect_to_wifi(WIFI_SSID, WIFI_PASSWORD)) {
    Serial.println("Failed to connect to WiFi");
    return;
  }
  Serial.println("Connected to WiFi");

  if(!connect_to_iot_station(DEVICE_ID, AUTH_TOKEN)) {
    Serial.println("Failed to connect to IoT Station");
    return;
  }

}

void loop() {
    if(!is_connected_to_wifi()) return;

    if(ping_iot_test()) {
        Serial.println("Ping to IoT test server successful");
    } else {
        Serial.println("Ping to IoT test server failed");
    }

    delay(60000); // Wait for 1 minute before next ping
}
