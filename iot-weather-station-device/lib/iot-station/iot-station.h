bool connect_to_wifi(const char* ssid, const char* password);
bool is_connected_to_wifi();
bool ping_iot_test();

bool connect_to_iot_station(const char* device_id, const char* auth_token);