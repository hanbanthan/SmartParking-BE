import mongoose from 'mongoose'

const fireWarningSchema = new mongoose.Schema({
  // Identity and Location 
  location: {
    row: {type: String, required: false},
    column: {type: String, required: false},
    floor: {type: String, required: true},
  },
  sensorId: {
    type: String,
    required: true,
    unique: true
  },

  // Data
  temperature: {
    type: Number,
    required: true,
    default: 0 // in Celsius
  },


  // Status
  status: {
    type: String,
    enum: ['normal','warning', 'offline'],
    default: 'normal',
    required: true
  },
}, {
  timestamps: true // adds createdAt and updatedAt
})


const FireWarning = mongoose.model('FireWarning', fireWarningSchema)

export default FireWarning

