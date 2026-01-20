#include <Arduino.h>
#include <iot-station.h> 

#define WIFI_SSID "SuperSecretIOTNetwork"
#define WIFI_PASSWORD "Password1!-1"

#define DEVICE_ID "your_device_id"
#define AUTH_TOKEN "your_auth_token"

#define SENSOR_READ_INTERVAL_SECONDS 60.0f

// Define CpuData struct outside of loop() - must be at global scope for template instantiation
struct CpuData: IotData {
    float cpu_usage;

    void serialize(JsonDocument& doc) override {
        IotData::serialize(doc); // Call base class serialize
        doc["cpu_usage"] = cpu_usage;
    }
};

void setup() {
  Serial.begin(115200);
  
  Serial.println();
  Serial.println("Initializing IoT station...");
  
  WifiSettings wifiSettings = {
      WIFI_SSID,
      WIFI_PASSWORD
  };
  
  IotClientSettings clientSettings = {
      DEVICE_ID,
      AUTH_TOKEN,
      "iot.example.com"
  };

  if (!init_iot_station(clientSettings, wifiSettings)) {
      Serial.println("Failed to initialize IoT station:");
      Serial.println(get_error_message());
      while (true) {
          delay(1000);
      }
  }

  Serial.println("IoT station initialized successfully.");

}

void loop() {
  Serial.println("Collecting CPU data...");

  CpuData data;
  data.time = get_npt_time();
  if(data.time < 0) {
      Serial.println("Failed to get NTP time:");
      Serial.println(get_error_message());
      while (true) {
          delay(1000);
      }
  }

  data.cpu_usage = ESP.getCpuFreqMHz() / 160.0f * 100.0f; // Example CPU usage calculation

  Serial.println("Sending data to IoT station...");
  send_iot_data(data);
  Serial.println("Data sent successfully.");

  if(deep_sleep_iot_client(SENSOR_READ_INTERVAL_SECONDS) < 0) {
      Serial.println("Failed to enter deep sleep:");
      Serial.println(get_error_message());
      while (true) {
          delay(1000);
      }
  }

  Serial.println("deep sleeped for 10 seconds...");
}
