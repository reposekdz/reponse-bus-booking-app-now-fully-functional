import { Request, Response } from 'express';
import * as walletService from './wallet.service';
import asyncHandler from '../../utils/asyncHandler';

export const topUpWallet = asyncHandler(async (req: any, res: any) => {
    const { amount } = req.body;
    const updatedUser = await walletService.topUpUserWallet(req.user!._id, amount);
    res.status(200).json({ success: true, data: updatedUser });
});

export const getWalletHistory = asyncHandler(async (req: any, res: any) => {
    const history = await walletService.getUserWalletHistory(req.user!._id);
    res.status(200).json({ success: true, data: history });
});

export const setPin = asyncHandler(async (req: any, res: any) => {
    const { pin } = req.body;
    await walletService.setUserPin(req.user!.id, pin);
    res.status(200).json({ success: true, message: 'PIN set successfully.' });
});

export const transferFunds = asyncHandler(async (req: any, res: any) => {
    const { toSerial, amount, pin } = req.body;
    // FIX: Destructured 'new_sender_balance' as returned by the service, which fixes the property not existing error.
    const { new_sender_balance } = await walletService.transferFunds(req.user, toSerial, amount, pin);
    res.status(200).json({ success: true, message: 'Transfer successful', data: { new_sender_balance } });
});