import express from 'express'
import {
  createTicket,
  listTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  checkoutTicket,
  reportStolen,
  calculateTicket,
  getWarningTickets,
  resolveTicketWarning
} from '../service/ticketService.js'
import auth from '../middleware/auth.js'

const ticketRouter = new express.Router()

const urlPrefix = '/api/tickets'

ticketRouter.post(`${urlPrefix}/create`, auth, createTicket)
ticketRouter.get(`${urlPrefix}`, auth, listTickets)
ticketRouter.get(`${urlPrefix}/:id`, auth, getTicket)
ticketRouter.put(`${urlPrefix}/:id/update`, auth, updateTicket)
ticketRouter.delete(`${urlPrefix}/:id/delete`, auth, deleteTicket)
ticketRouter.post(`${urlPrefix}/checkout/:id`, auth, checkoutTicket); 
ticketRouter.put(`${urlPrefix}/report/:id`, auth, reportStolen); 
ticketRouter.get(`${urlPrefix}/calculate/:id`, auth, calculateTicket);
ticketRouter.get(`${urlPrefix}/warnings/active`, auth, getWarningTickets);
ticketRouter.put(`${urlPrefix}/warnings/resolve/:id`, auth, resolveTicketWarning);

export default ticketRouter;