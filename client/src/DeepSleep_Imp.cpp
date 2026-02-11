#include "DeepSleep_Impl.h"
#include <Arduino.h>


#ifdef ESP8266

    void deepSleep(int seconds)
    {
        ESP.deepSleep(seconds * 1000000);
    }

#else

    void deepSleep(int seconds) 
    {
        delay(100); // Ensure all serial output is sent before sleepings
        delay(1000 * seconds);
    }

#endif
