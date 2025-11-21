import Ticket from '../models/ticket.js'
import Response from '../common/utils.js'

export const listTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
    return res.status(200).json(Response({
      message: 'List tickets successfully',
      data: tickets,
    }))
  } catch (e) {
    console.log(`List tickets failed: ${e}`)
    return res.status(500).json(Response({
      message: 'List tickets failed',
      data: null,
    }))
  }
}

export const getTicket = async (req, res) => {
  try {
    const ticketId = req.params.id
    const ticket = await Ticket.findOne(ticketId)
    if (!ticket) {
      return res.status(404).json(Response({
        message: 'Ticket not found',
        data: null,
      }))
    }
    return res.status(200).json(Response({
      message: 'Get ticket successfully',
      data: slot,
    }))
  } catch (e) {
    console.log(`Get ticket failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Get ticket failed',
      data: null,
    }))
  }
}

export const createTicket = async (req, res) => {
  try {
    const body = req.body
    // Validate
    const ticket = await Ticket.create(body)
    return res.status(201).json(Response({
      message: 'Create ticket successfully',
      data: slot,
    }))
  } catch (e) {
    console.log(`Create ticket failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Create ticket failed',
      data: null,
    }))
  }
}

export const updateTicket = async (req, res) => {
  try {
    const body = req.body
    const ticketId = req.params.id
    // Validate
    await Ticket.findOneAndUpdate(ticketId, body, {new: true})
    return res.status(201).json(Response({
      message: 'Update ticket successfully',
      data: body,
    }))
  } catch (e) {
    console.log(`Update ticket failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Update ticket failed',
      data: null,
    }))
  }
}

export const deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id
    await Ticket.findOneAndDelete(ticketId)
    return res.status(200).json(Response({
      message: 'Delete ticket successfully',
      data: null,
    }))
  } catch (e) {
    console.log(`Delete ticket failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Delete ticket failed',
      data: null,
    }))
  }
}