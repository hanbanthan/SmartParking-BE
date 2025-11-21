import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: false,
  },
  checkInTime: {type: String, required: true},
  checkOutTime: {type: String, required: true},
  isPaid: {type: Boolean, required: true, default: false},
})

const Ticket = mongoose.model('Ticket', ticketSchema)

export default Ticket