import express from 'express';
const iotRouter = new express.Router();

iotRouter.get('/api/iot/slots', async (req, res) => {
    try {
        const slots = await Slot.find();
        res.status(200).json(slots);
    } catch (error) { 
        res.status(500).json({ error: 'Failed to get slots' });
    }
}); 

export default iotRouter;