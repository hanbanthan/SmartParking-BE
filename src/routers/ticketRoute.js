import express from 'express'
import {
  createTicket,
  listTickets,
  getTicket,
  updateTicket,
  deleteTicket,
} from '../service/ticketService.js'
import auth from '../middleware/auth.js'

const ticketRouter = new express.Router()

const urlPrefix = '/api/tickets'

ticketRouter.post(`${urlPrefix}/create`, auth, createTicket)
ticketRouter.get(`${urlPrefix}`, auth, listTickets)
ticketRouter.get(`${urlPrefix}/:id`, auth, getTicket)
ticketRouter.put(`${urlPrefix}/:id/update`, auth, updateTicket)
ticketRouter.delete(`${urlPrefix}/:id/delete`, auth, deleteTicket)