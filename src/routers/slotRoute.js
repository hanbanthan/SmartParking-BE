import express from 'express'
import {
  createSlot,
  listSlots,
  getSlot,
  updateSlot,
  deleteSlot,
} from '../service/slotService.js'
import auth from '../middleware/auth.js'

const slotRouter = new express.Router()

const urlPrefix = '/api/slots'

slotRouter.post(`${urlPrefix}/create`, auth, createSlot)
slotRouter.get(`${urlPrefix}`, auth, listSlots)
slotRouter.get(`${urlPrefix}/:id`, auth, getSlot)
slotRouter.put(`${urlPrefix}/:id/update`, auth, updateSlot)
slotRouter.delete(`${urlPrefix}/:id/delete`, auth, deleteSlot)