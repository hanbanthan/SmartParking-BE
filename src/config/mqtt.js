import mqtt from 'mqtt';
import Slot from '../models/slot.js';
import FireWarning from '../models/fireWarning.js';
import MQTT_TOPICS from './mqttTopics.js';

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
                    io.emit('parking_update', updatedSlot);
                }
            }

            // Handle DHT11 fire sensor data
            if (topic === MQTT_TOPICS.FIRE_TEMPERATURE) {
                const { sensorId, temperature } = payload;

                let sensor = await FireWarning.findOne({ sensorId: sensorId });
                const limit = sensor?.limit || 50;

                // Detection - Check if temperature exceeds limit
                const isWarning = temperature > limit;
                const status = isWarning ? 'warning' : 'normal';

                const updatedSensor = await FireWarning.findOneAndUpdate(
                    { sensorId: sensorId },
                    {
                        temperature: temperature,
                        status: status,
                    },
                    { new: true, upsert: false }
                );

                if (updatedSensor) {
                    console.log(`DHT11 Sensor ${sensorId}: ${temperature}°C - ${status} (Limit: ${limit}°C)`);

                    // Always emit sensor update for frontend display
                    io.emit('fire_sensor_update', updatedSensor);


                    if (isWarning) {
                        console.log(`FIRE ALERT TRIGGERED: ${sensorId} - Temperature ${temperature}°C exceeds limit ${limit}°C`);

                        io.emit('fire_warning', {
                            sensor: updatedSensor,
                            message: `Fire Alert at Floor ${updatedSensor.location.floor}${updatedSensor.location.column ? ', Column ' + updatedSensor.location.column : ''}${updatedSensor.location.row ? ', Row ' + updatedSensor.location.row : ''}`,
                            temperature: temperature,
                            limit: limit,
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