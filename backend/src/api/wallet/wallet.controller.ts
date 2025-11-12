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