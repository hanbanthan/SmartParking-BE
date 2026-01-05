import express from 'express';
import MQTT_TOPICS from '../config/mqttTopics.js';
import Slot from '../models/slot.js';

const iotRouter = new express.Router();

iotRouter.get('/api/iot/slots', async (req, res) => {
    try {
        const slots = await Slot.find();
        res.status(200).json(slots);
    } catch (error) { 
        res.status(500).json({ error: 'Failed to get slots' });
    }
}); 

// API to control gate (open/close)
iotRouter.post('/api/iot/gate/control', async (req, res) => {
    try {
        const { action } = req.body;

        // Validate action
        if (!action || !['open', 'close'].includes(action.toLowerCase())) {
            return res.status(400).json({ 
                error: 'Invalid action. Must be "open" or "close"' 
            });
        }

        // Get MQTT client from app
        const mqttClient = req.app.get('mqttClient');
        
        if (!mqttClient || !mqttClient.connected) {
            return res.status(503).json({ 
                error: 'MQTT client not connected' 
            });
        }

        // Prepare message
        const message = JSON.stringify({ 
            action: action.toLowerCase(),
            timestamp: new Date().toISOString()
        });

        // Publish to MQTT topic
        mqttClient.publish(MQTT_TOPICS.GATE_CONTROL, message, (err) => {
            if (err) {
                console.error('Failed to publish gate control message:', err);
                return res.status(500).json({ 
                    error: 'Failed to send gate control command' 
                });
            }

            console.log(`Gate control command sent: ${action}`);
            return res.status(200).json({ 
                success: true,
                message: `Gate ${action} command sent successfully`,
                action: action.toLowerCase(),
                topic: MQTT_TOPICS.GATE_CONTROL,
                timestamp: new Date().toISOString()
            });
        });

    } catch (error) {
        console.error('Error controlling gate:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

export default iotRouter;