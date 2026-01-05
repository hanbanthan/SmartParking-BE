export const MQTT_TOPICS = {
    SLOT_UPDATE: 'parking/update',   

    // LED Control
    //LED_CONTROL: 'iot/control/led',

    // Fire Warning - DHT11 Temperature Sensor (ESP32 -> Server)
    FIRE_TEMPERATURE: 'parking/alert',

    // Fire Warning Control (Server -> ESP32)
    //FIRE_BUZZER_CONTROL: 'iot4/parking/device/fire/buzzer/control',

    // Gate
    GATE_CONTROL: 'parking/gate_cmd',
}

export default MQTT_TOPICS

// // Topic MQTT
// const char* topic_update = "parking/update";
// const char* topic_alert  = "parking/alert";
// const char* topic_led    = "parking/gate_cmd";