import mqtt from 'mqtt';
import Slot from '../models/slot.js';


const connectMQTT = (io) => {
    const client = mqtt.connect('mqtt://broker.hivemq.com');

    const TOPIC = 'iot4/parking/sensors/update';
    
    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe(TOPIC, (err) => {
            if (err) {
                console.error('Failed to subscribe to topic', err);
            }
        });
    });
    
    client.on('message', async (topic, message) => {
        try {
            const payload = JSON.parse(message.toString());
    
            const updatedSlot = await Slot.findOneAndUpdate(
                { row: payload.row, column: payload.column, floor: payload.floor },
                { status: payload.status },
                { new: true, upsert: true }
            );
            console.log('Updated slot', updatedSlot);
    
            if (updatedSlot) {
                io.emit('parking_update', updatedSlot);
            }
        } catch (error) {
            console.error('Error processing message', error);
        }
    });    
}

export default connectMQTT;