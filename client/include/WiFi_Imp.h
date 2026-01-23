#pragma once

#if defined(ARDUINO_ARCH_SAMD) || defined(ARDUINO_ARCH_RP2040)
#include <WiFiNINA.h>
#elif defined(ARDUINO_ARCH_ESP32)
#include <WiFi.h>
#elif defined(ARDUINO_ARCH_ESP8266)
#include <ESP8266WiFi.h>
#endif

#include <ArduinoJson.h>
#include <ArduinoHttpClient.h>

void connect_wifi(const char *ssid, const char *password);
bool send_json_data(JsonDocument &doc, HttpClient &client, const char *path);
void print_wifi_status();
