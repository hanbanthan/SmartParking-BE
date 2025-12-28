import express from 'express'
import {
  createFireSensor,
  listFireSensors,
  getFireSensor,
  getFireSensorBySensorId,
  updateFireSensor,
  updateThreshold,
  deleteFireSensor,
  getActiveWarnings,
  acknowledgeWarning,
  getFireStatistics,
} from '../service/fireWarningService.js'
import auth from '../middleware/auth.js'

const fireWarningRouter = new express.Router()

const urlPrefix = '/api/fire-warning'

// Fire sensor CRUD operations
fireWarningRouter.post(`${urlPrefix}/sensors/create`, auth, createFireSensor)
fireWarningRouter.get(`${urlPrefix}/sensors`, auth, listFireSensors)
fireWarningRouter.get(`${urlPrefix}/sensors/:id`, auth, getFireSensor)
fireWarningRouter.get(`${urlPrefix}/sensors/by-sensor/:sensorId`, auth, getFireSensorBySensorId)
fireWarningRouter.put(`${urlPrefix}/sensors/:id/update`, auth, updateFireSensor)
fireWarningRouter.put(`${urlPrefix}/sensors/:id/threshold`, auth, updateThreshold)
fireWarningRouter.delete(`${urlPrefix}/sensors/:id/delete`, auth, deleteFireSensor)

// Warning management
fireWarningRouter.get(`${urlPrefix}/warnings/active`, auth, getActiveWarnings)
fireWarningRouter.post(`${urlPrefix}/warnings/:id/acknowledge`, auth, acknowledgeWarning)

// Statistics and history
fireWarningRouter.get(`${urlPrefix}/statistics`, auth, getFireStatistics)

export default fireWarningRouter

