#include <Arduino.h>
#include <iot-station.h> 

#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

#define WIFI_SSID "SuperSecretIOTNetwork"
#define WIFI_PASSWORD "Password1!-1"

#define DEVICE_ID "your_device_id"
#define AUTH_TOKEN "your_auth_token"

#define SEALEVELPRESSURE_HPA (1013.25)

#define SENSOR_READ_INTERVAL_SECONDS 60.0f

Adafruit_BME280 bme; 

struct CpuData: IotData {
    float temperature;
    float humidity;

    void serialize(JsonDocument& doc) override {
        IotData::serialize(doc); // Call base class serialize
        doc["temperature"] = temperature;
        doc["humidity"] = humidity;
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
      "192.168.1.54:3000" // Local Test
  };

  if (!init_iot_station(clientSettings, wifiSettings)) {
      Serial.println("Failed to initialize IoT station:");
      Serial.println(get_error_message());
      while (true) {
          delay(1000);
      }
  }

  Serial.println("Setting up BME280 sensor...");
  if(!bme.begin(0x76)) {
      Serial.println("Could not find a valid BME280 sensor, check wiring!");
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

  data.temperature = bme.readTemperature();
  data.humidity = bme.readHumidity();

  Serial.println("Sending data to IoT station...");
  send_iot_data(data);
  Serial.println("Data sent successfully.");

  Serial.println("Sent Data:");
    Serial.print("  Time: "); Serial.println(data.time);
    Serial.print("  Temperature: "); Serial.print(data.temperature); Serial.println(" °C");
    Serial.print("  Humidity: "); Serial.print(data.humidity); Serial.println(" %");

  if(deep_sleep_iot_client(SENSOR_READ_INTERVAL_SECONDS) < 0) {
      Serial.println("Failed to enter deep sleep:");
      Serial.println(get_error_message());
      while (true) {
          delay(1000);
      }
  }

  Serial.println("deep sleeped for 60 seconds...");
}
