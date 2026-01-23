#include "WiFi_Imp.h"

#include "ArduinoJson.h"

void print_wifi_status()
{
    // print the SSID of the network you're attached to:
    Serial.print("SSID: ");
    Serial.println(WiFi.SSID());

    // print your board's IP address:
    IPAddress ip = WiFi.localIP();
    Serial.print("IP Address: ");
    Serial.println(ip);
}

WiFiClient connect_wifi(const char *ssid, const char *password)
{

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

    WiFi.begin(ssid, password);

    // attempt to connect to WiFi network:
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print("Attempting to connect to SSID: ");
        Serial.println(ssid);

        delay(5000);
    }
    Serial.println("Connected to WiFi");
    print_wifi_status();

    WiFiClient client;
    return client;
}

bool send_json_data(ArduinoJson::JsonDocument &doc, WiFiClient client, const char *server, int port)
{
    String json = doc.as<String>();

    if (client.connect(server, port))
    {
        Serial.println("connected to server");
        // Make a HTTP POST request
        client.println("POST /weather HTTP/1.1");

        // Corrrect HTTP headers
        client.print("Host: ");
        client.print(server);
        client.print(":");
        client.println(port);

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
    else
    {
        return false;
    }

    return true;
}
