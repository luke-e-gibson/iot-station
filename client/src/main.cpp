#include <Arduino.h>

#if defined(ARDUINO_ARCH_SAMD) || defined(ARDUINO_ARCH_RP2040)
#include <WiFiNINA.h>
#elif defined(ARDUINO_ARCH_ESP32)
#include <WiFi.h>
#elif defined(ARDUINO_ARCH_ESP8266)
#include <ESP8266WiFi.h>
#endif

#include "arduino_secrets.h"
char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

int status = WL_IDLE_STATUS;

IPAddress server(192, 168, 137, 1); // numeric IP (no DNS)
// char server[] = "www.google.com"; // name address (using DNS)
WiFiClient client;

void printWifiStatus()
{
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
}

void setup()
{
  // Initialize serial and wait for port to open:
  Serial.begin(9600);
  while (!Serial)
  {
    ; // wait for serial port to connect. Needed for native USB port only
  }

#if defined(ARDUINO_ARCH_SAMD) || defined(ARDUINO_ARCH_RP2040)
  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE)
  {
    Serial.println("Communication with WiFiNINA module failed!");
    // don't continue
    while (true)
      ;
  }
#endif

  // attempt to connect to WiFi network:
  while (status != WL_CONNECTED)
  {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(10000);
  }
  Serial.println("Connected to WiFi");
  printWifiStatus();

  Serial.println("\nStarting connection to server...");
  // if you get a connection, report back via serial:
  if (client.connect(server, 3000))
  {
    Serial.println("connected to server");
    // Make a HTTP GET request:
    client.println("GET /weather HTTP/1.1");
    client.println("Host: 192.168.137.1:3000");
    client.println("Connection: close");
    client.println();

    while (client.connected() || client.available())
    {
      if (client.available())
      {
        char c = client.read();
        Serial.write(c);
      }
    }
    client.stop();
  }

  if (client.connect(server, 3000))
  {
    Serial.println("connected to server");
    // Make a HTTP POST request
    String json = "{\"temperature\":" + String(random(10, 30)) + ",\"humidity\":" + String(random(30, 60)) + "}";
    client.println("POST /weather HTTP/1.1");
    client.println("Host: 192.168.137.1:3000");
    client.println("Content-Type: application/json");
    client.print("Content-Length: ");
    client.println(json.length());
    client.println("Connection: close");
    client.println();
    client.println(json);
    client.println();

    while (client.connected() || client.available())
    {
      if (client.available())
      {
        char c = client.read();
        Serial.write(c);
      }
    }
    client.stop();
  }
}

void loop()
{
  // if there are incoming bytes available
  // from the server, read them and print them:
  while (client.available())
  {
    char c = client.read();
    Serial.write(c);
  }

  // if the server's disconnected, stop the client:
  if (!client.connected())
  {
    Serial.println();
    Serial.println("disconnecting from server.");
    client.stop();
  }

  // do nothing forevermore:
  while (true)
    ;
}
