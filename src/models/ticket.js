import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  checkInTime: { type: Date, default: Date.now }, // Tự động lấy giờ hiện tại
  checkOutTime: { type: Date },                   // Để trống khi mới vào
  totalPrice: { type: Number, default: 0 },       // Thêm trường để lưu tiền
  isPaid: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['active', 'completed', 'warning'],
    default: 'active'
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema)

export default Ticket