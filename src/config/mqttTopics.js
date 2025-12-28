export const MQTT_TOPICS = {
    SLOT_UPDATE: 'iot4/parking/sensors/update',   

    // LED Control
    LED_CONTROL: 'iot/control/led',

    // Fire Warning - DHT11 Temperature Sensor (ESP32 -> Server)
    FIRE_TEMPERATURE: 'iot4/parking/sensors/fire/temperature',

    // Fire Warning Control (Server -> ESP32)
    FIRE_ALARM_CONTROL: 'iot4/parking/device/fire/alarm/control',
    FIRE_BUZZER_CONTROL: 'iot4/parking/device/fire/buzzer/control',
}

export default MQTT_TOPICS