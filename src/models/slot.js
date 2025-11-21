import mongoose from 'mongoose'

const slotSchema = new mongoose.Schema({
  row: {type: String, required: true},
  column: {type: String, required: true},
  floor: {type: String, required: true},
  status: {type: String, required: true},
})

const Slot = mongoose.model('Slot', slotSchema)

export default Slot