#include "Sensor-BME.h"
#include <Adafruit_BME280.h>

Adafruit_BME280 bme; // I2C

void init_sensor() 
{
    // Initialize the BME280 sensor
    if (!bme.begin(0x76)) {
        Serial.println("Could not find a valid BME280 sensor, check wiring!");
        while (1);
    }
}

float read_temperature() 
{
    return bme.readTemperature();
}

float read_humidity() 
{
    return bme.readHumidity();
}