import Slot from '../models/slot.js'
import { Response } from '../common/utils.js';

export const listSlots = async (req, res) => {
  try {
    const { active } = req?.query
    let query = {}
    if (active) {
      query.status = { $not: /^inactive$/i }
    }
    const slots = await Slot.find(query)
    return res.status(200).json(Response({
      message: 'List slots successfully',
      data: slots,
    }))
  } catch (e) {
    console.log(`List slots failed: ${e}`)
    return res.status(500).json(Response({
      message: 'List slots failed',
      data: null,
    }))
  }
}

export const getSlot = async (req, res) => {
  try {
    const slotId = req.params.id
    const slot = await Slot.findOne(slotId)
    if (!slot) {
      return res.status(404).json(Response({
        message: 'Slot not found',
        data: null,
      }))
    }
    return res.status(200).json(Response({
      message: 'Get slot successfully',
      data: slot,
    }))
  } catch (e) {
    console.log(`Get slot failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Get slot failed',
      data: null,
    }))
  }
}

export const createSlot = async (req, res) => {
  try {
    const body = req.body
    // Validate
    const slot = await Slot.create(body)
    return res.status(201).json(Response({
      message: 'Create slot successfully',
      data: slot,
    }))
  } catch (e) {
    console.log(`Create slot failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Create slot failed',
      data: null,
    }))
  }
}

export const updateSlot = async (req, res) => {
  try {
    const body = req.body;
    const slotId = req.params.id;

    // SỬA DÒNG NÀY: Truyền vào một object { _id: slotId } thay vì chỉ slotId
    const updatedSlot = await Slot.findOneAndUpdate(
      { _id: slotId }, // Filter phải là object
      body, 
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(404).json(Response({
        message: 'Không tìm thấy ô đỗ xe này',
        data: null
      }));
    }

    return res.status(200).json(Response({
      message: 'Update slot successfully',
      data: updatedSlot,
    }));
  } catch (e) {
    console.log(`Update slot failed: ${e}`);
    return res.status(500).json(Response({
      message: 'Update slot failed',
      data: null,
    }));
  }
}

export const deleteSlot = async (req, res) => {
  try {
    const slotId = req.params.id
    await Slot.findOneAndDelete(slotId)
    return res.status(200).json(Response({
      message: 'Delete slot successfully',
      data: null,
    }))
  } catch (e) {
    console.log(`Delete slot failed: ${e}`)
    return res.status(500).json(Response({
      message: 'Delete slot failed',
      data: null,
    }))
  }
}