import FireWarning from '../models/fireWarning.js'
import { Response } from '../common/utils.js'

export const listFireSensors = async (req, res) => {
  try {
    const { status, floor, isWarning } = req?.query
    let query = {}
    
    if (status) {
      query.status = status
    }
    if (floor) {
      query['location.floor'] = floor;
    }
    if (isWarning !== undefined) {
        query.isWarning = isWarning === 'true';
    }
    
    const sensors = await FireWarning.find(query)
      .sort({ 'floor': 1, temperature: -1 })
    
    return res.status(200).json(Response({
      message: 'List fire sensors successfully',
      data: sensors,
    }))
  } catch (e) {
    console.log(`List fire sensors failed: ${e}`)
    return res.status(500).json(Response({
      message: 'List fire sensors failed',
      data: null,
    }))
  }
}

export const getFireSensor = async (req, res) => {
  try {
    const sensorId = req.params.id
    const sensor = await FireWarning.findById(sensorId)
    if (!sensor) {
      return res.status(404).json(Response({
        message: 'Fire sensor not found',
        data: null,
      }))
    }
    return res.status(200).json(Response({
      message: 'Get fire sensor successfully',
      data: sensor,
    }))
  } catch (e) {
    console.log(`Get fire sensor failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Get fire sensor failed',
      data: null,
    }))
  }
}

export const getFireSensorBySensorId = async (req, res) => {
  try {
    const { sensorId } = req.params
    const sensor = await FireWarning.findOne({ sensorId })
    if (!sensor) {
      return res.status(404).json(Response({
        message: 'Fire sensor not found',
        data: null,
      }))
    }
    return res.status(200).json(Response({
      message: 'Get fire sensor successfully',
      data: sensor,
    }))
  } catch (e) {
    console.log(`Get fire sensor failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Get fire sensor failed',
      data: null,
    }))
  }
}

export const createFireSensor = async (req, res) => {
  try {
    const body = req.body
    
    // Check if sensor with this sensorId already exists
    const existingSensor = await FireWarning.findOne({ sensorId: body.sensorId })
    if (existingSensor) {
      return res.status(400).json(Response({
        message: 'Fire sensor with this sensorId already exists',
        data: null,
      }))
    }
    
    const sensor = await FireWarning.create(body)
    return res.status(201).json(Response({
      message: 'Create fire sensor successfully',
      data: sensor,
    }))
  } catch (e) {
    console.log(`Create fire sensor failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Create fire sensor failed',
      data: null,
    }))
  }
}

export const updateFireSensor = async (req, res) => {
  try {
    const body = req.body
    const sensorId = req.params.id
    
    const updatedSensor = await FireWarning.findByIdAndUpdate(
      sensorId, 
      body, 
      { new: true, runValidators: true }
    )
    
    if (!updatedSensor) {
      return res.status(404).json(Response({
        message: 'Fire sensor not found',
        data: null,
      }))
    }
    
    return res.status(200).json(Response({
      message: 'Update fire sensor successfully',
      data: updatedSensor,
    }))
  } catch (e) {
    console.log(`Update fire sensor failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Update fire sensor failed',
      data: null,
    }))
  }
}

export const updateThreshold = async (req, res) => {
  try {
    const sensorId = req.params.id
    const { limit } = req.body
    
    if (limit == undefined) {
        return res.status(400).json(Response({
            message: 'Limit is required',
            data: null,
        }))
    }
    
    const updatedSensor = await FireWarning.findByIdAndUpdate(
      sensorId,
      { limit: Number(limit) },
      { new: true }
    )
    
    if (!updatedSensor) {
      return res.status(404).json(Response({
        message: 'Fire sensor not found',
        data: null,
      }))
    }
    
    return res.status(200).json(Response({
      message: 'Update threshold successfully',
      data: updatedSensor,
    }))
  } catch (e) {
    console.log(`Update threshold failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Update threshold failed',
      data: null,
    }))
  }
}

export const deleteFireSensor = async (req, res) => {
  try {
    const sensorId = req.params.id
    const deletedSensor = await FireWarning.findByIdAndDelete(sensorId)
    
    if (!deletedSensor) {
      return res.status(404).json(Response({
        message: 'Fire sensor not found',
        data: null,
      }))
    }
    
    return res.status(200).json(Response({
      message: 'Delete fire sensor successfully',
      data: null,
    }))
  } catch (e) {
    console.log(`Delete fire sensor failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Delete fire sensor failed',
      data: null,
    }))
  }
}

export const getActiveWarnings = async (req, res) => {
  try {
    const warnings = await FireWarning.find({ 
        status: 'warning'
    }).sort({ temperature: -1 })
    
    return res.status(200).json(Response({
      message: 'Get active fire warnings successfully',
      data: warnings,
    }))
  } catch (e) {
    console.log(`Get active fire warnings failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Get active fire warnings failed',
      data: null,
    }))
  }
}

export const acknowledgeWarning = async (req, res) => {
  try {
    const sensorId = req.params.id;
    
    const sensor = await FireWarning.findByIdAndUpdate(
      sensorId,
      { 
        status: 'normal'
      },
      { new: true }
    )
    
    if (!sensor) {
      return res.status(404).json(Response({
        message: 'Fire sensor not found',
        data: null,
      }))
    }

    const mqttClient = await connectMQTT();

    const payload = JSON.stringify({
      sensorId: sensor.sensorId,
      action: 'OFF',
    })

    mqttClient.publish(MQTT_TOPICS.FIRE_BUZZER_CONTROL, payload, 
      { qos: 1 },
    );
    
    return res.status(200).json(Response({
      message: 'Fire warning acknowledged successfully',
      data: sensor,
    }))
  } catch (e) {
    console.log(`Acknowledge warning failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Acknowledge warning failed',
      data: null,
    }))
  }
}

export const getFireStatistics = async (req, res) => {
  try {
    const { floor } = req?.query;
    let query = {};
    
    if (floor) {
      query.floor = floor;
    }
    
    const sensors = await FireWarning.find(query)
    
    const statistics = {
      total: sensors.length,
      normal: sensors.filter(s => s.status === 'normal').length,
      warning: sensors.filter(s => s.status === 'warning').length,
      offline: sensors.filter(s => s.status === 'offline').length,
      activeWarnings: sensors.filter(s => s.status === 'warning').length,
      averageTemperature: sensors.reduce((sum, s) => sum + s.temperature, 0) / sensors.length || 0,
      maxTemperature: Math.max(...sensors.map(s => s.temperature), 0),
    }
    
    return res.status(200).json(Response({
      message: 'Get fire statistics successfully',
      data: statistics,
    }))
  } catch (e) {
    console.log(`Get fire statistics failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Get fire statistics failed',
      data: null,
    }))
  }
}
