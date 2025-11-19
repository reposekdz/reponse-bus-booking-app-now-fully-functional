import * as paymentService from './payments.service';
import asyncHandler from '../../utils/asyncHandler';

export const initiateMomoPayment = asyncHandler(async (req, res) => {
    const { phone, ...bookingDetails } = req.body;
    const result = await paymentService.initiateMomoPayment(req.user.id, phone, bookingDetails);
    res.status(200).json({ success: true, message: result.message });
});

export const handleMomoCallback = asyncHandler(async (req, res) => {
    await paymentService.handleMomoCallback(req.body);
    // Respond immediately to the callback provider
    res.status(200).json({ success: true, message: 'Callback received.' });
});
