import { Request, Response } from 'express';
import * as companyService from './company.service';
import asyncHandler from '../../utils/asyncHandler';

export const getCompanies = asyncHandler(async (req: any, res: any) => {
    const companies = await companyService.getAllCompanies();
    res.status(200).json({ success: true, data: companies });
});

export const getCompanyById = asyncHandler(async (req: any, res: any) => {
    const company = await companyService.getCompanyById(req.params.id);
    res.status(200).json({ success: true, data: company });
});