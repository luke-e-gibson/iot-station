#include <ArduinoJson.h>

struct WifiSettings {
    const char* ssid;
    const char* password;
};

struct IotClientSettings {
    const char* device_id;
    const char* auth_token;
    const char* server_url;
    const char* ntp_server = "pool.ntp.org";
};

struct IotData {
    float time;

    virtual void serialize(JsonDocument& doc) {
        doc["time"] = time;
    }
};

bool init_iot_station(const IotClientSettings& settings, const WifiSettings& wifiSettings);
bool send_iot_data(IotData& data);

float get_npt_time();
float deep_sleep_iot_client(float sleepDurationSeconds);

const char* get_error_message();
