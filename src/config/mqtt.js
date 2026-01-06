import mqtt from 'mqtt';
import Slot from '../models/slot.js';
import FireWarning from '../models/fireWarning.js';
import MQTT_TOPICS from './mqttTopics.js';
import { SOCKET_EVENTS } from './socketEvents.js';

const connectMQTT = (io) => {
    const client = mqtt.connect('mqtt://broker.hivemq.com');

    client.on('connect', () => {
        console.log('Connected to MQTT broker');

        // setInterval(() => {
        //     console.log("Đang test socket...");
        //     io.emit('parking_update', { _id: "test", status: "occupied", name: "Test Slot" });
        // }, 5000);

        const topics = Object.values(MQTT_TOPICS);
        topics.forEach(topic => {
            client.subscribe(topic, (err) => {
                if (err) {
                    console.error('Failed to subscribe to', topic, err);
                } else {
                    console.log('Subscribed to', topic);
                }
            });
        });
    });

    client.on('message', async (topic, message) => {
        try {
            let payload;
            const messageStr = message.toString();

            try {
                payload = JSON.parse(messageStr);
            } catch (error) {
                // Ignore non-JSON messages (e.g., plain text like "ON", "OFF")
                console.log(` Non-JSON message on topic "${topic}": ${messageStr}`);
                return;
            }

            // Handle parking slot updates
            if (topic === MQTT_TOPICS.SLOT_UPDATE) {
                const updatedSlot = await Slot.findOneAndUpdate(
                    { row: payload.row, column: payload.column, floor: payload.floor },
                    { status: payload.status },
                    { new: true, upsert: true }
                );
                console.log('Updated slot', updatedSlot);

                if (updatedSlot) {
                    io.emit(SOCKET_EVENTS.PARKING_UPDATE, updatedSlot);
                }
            }

            // Handle DHT11 fire sensor data
            if (topic === MQTT_TOPICS.FIRE_TEMPERATURE) {
                const { sensorId, temperature, status } = payload;

                let sensor = await FireWarning.findOne({ sensorId: sensorId });

                const updatedSensor = await FireWarning.findOneAndUpdate(
                    { sensorId: sensorId },
                    {
                        temperature: temperature,
                        status: status,
                    },
                    { new: true, upsert: false }
                );

                if (updatedSensor) {
                    console.log(`DHT11 Sensor ${sensorId}: ${temperature}°C - ${status}`);

                    // Always emit sensor update for frontend display
                    io.emit(SOCKET_EVENTS.FIRE_SENSOR_UPDATE, updatedSensor);


                    if (status === 'warning') {
                        console.log(`FIRE ALERT TRIGGERED: ${sensorId} - Temperature ${temperature}°C`);

                        io.emit(SOCKET_EVENTS.FIRE_WARNING, {
                            sensor: updatedSensor,
                            message: `Fire Alert at Floor ${updatedSensor.location.floor}${updatedSensor.location.column ? ', Column ' + updatedSensor.location.column : ''}${updatedSensor.location.row ? ', Row ' + updatedSensor.location.row : ''}`,
                            temperature: temperature,
                            status: status,
                            timestamp: new Date()
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error processing MQTT message:', error);
        }
    });

    // Return client for sending control commands
    return client;
}


export default connectMQTT;