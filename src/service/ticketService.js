import Ticket from '../models/ticket.js'
import { Response } from '../common/utils.js';

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
      data: ticket,
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
    // Chỉ cần userId và slotId từ body
    const { userId, slotId } = req.body;
    
    // Kiểm tra nếu user đã có vé chưa thanh toán
    const existing = await Ticket.findOne({ userId, isPaid: false });
    if (existing) return res.status(400).json(Response({ message: 'Bạn đang có vé chưa hoàn tất' }));

    const ticket = await Ticket.create({ userId, slotId });
    return res.status(201).json(Response({ message: 'Check-in thành công', data: ticket }));
  } catch (e) {
    return res.status(500).json(Response({ message: 'Lỗi tạo vé' }));
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

export const checkoutTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json(Response({ message: 'Vé không tồn tại' }));
    if (ticket.isPaid) return res.status(400).json(Response({ message: 'Vé này đã thanh toán rồi' }));

    const now = new Date();
    const durationMs = now - new Date(ticket.checkInTime);
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
    
    ticket.checkOutTime = now;
    ticket.totalPrice = durationHours * 5000;
    ticket.isPaid = true;
    ticket.status = 'completed';
    
    await ticket.save();

    return res.status(200).json(Response({ 
      message: 'Thanh toán thành công', 
      data: ticket 
    }));
  } catch (e) {
    return res.status(500).json(Response({ message: 'Lỗi hệ thống khi thanh toán' }));
  }
}

export const calculateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json(Response({ message: 'Vé không tồn tại' }));
    }

    const now = new Date();
    // Tính số giờ đỗ (Làm tròn lên, ít nhất là 1 giờ)
    const durationMs = now - new Date(ticket.checkInTime);
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60)); 
    const pricePerHour = 5000; // Có thể tùy chỉnh giá ở đây
    const totalPrice = durationHours * pricePerHour;

    return res.status(200).json(Response({
      message: 'Tính toán tiền gửi xe thành công',
      data: {
        startTime: ticket.checkInTime,
        endTime: now,
        durationHours: durationHours,
        totalPrice: totalPrice,
        slotId: ticket.slotId
      }
    }));
  } catch (e) {
    return res.status(500).json(Response({ message: 'Lỗi tính toán tiền vé' }));
  }
};

export const reportStolen = async (req, res) => {
  try {
    const { id } = req.params;
    await Ticket.findByIdAndUpdate(id, { status: 'warning' });
    // Ở đây có thể gửi email thông báo cho bảo vệ bãi xe
    return res.status(200).json(Response({ message: 'Đã báo cáo sự cố cho quản lý!' }));
  } catch (e) {
    return res.status(500).json(Response({ message: 'Lỗi báo cáo' }));
  }
}
