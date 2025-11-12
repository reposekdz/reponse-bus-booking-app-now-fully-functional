import { Request, Response } from 'express';
import * as adminService from './admin.service';
import asyncHandler from '../../utils/asyncHandler';

// Company Controllers
// FIX: Removed explicit types to allow for correct type inference.
export const createCompany = asyncHandler(async (req: Request, res: Response) => {
    const company = await adminService.createCompany(req.body);
    res.status(201).json({ success: true, data: company });
});

// FIX: Removed explicit types to allow for correct type inference.
export const getCompanies = asyncHandler(async (req: Request, res: Response) => {
    const companies = await adminService.getAllCompanies();
    res.status(200).json({ success: true, count: companies.length, data: companies });
});

// FIX: Removed explicit types to allow for correct type inference.
export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
    const company = await adminService.updateCompanyById(req.params.id, req.body);
    res.status(200).json({ success: true, data: company });
});

// FIX: Removed explicit types to allow for correct type inference.
export const deleteCompany = asyncHandler(async (req: Request, res: Response) => {
    await adminService.deleteCompanyById(req.params.id);
    res.status(200).json({ success: true, data: {} });
});


// Driver Controllers
export const createDriver = asyncHandler(async (req: any, res: any) => {
    const driver = await adminService.createDriver(req.body);
    res.status(201).json({ success: true, data: driver });
});

export const getDrivers = asyncHandler(async (req: any, res: any) => {
    const drivers = await adminService.getAllDrivers();
    res.status(200).json({ success: true, count: drivers.length, data: drivers });
});

export const updateDriver = asyncHandler(async (req: any, res: any) => {
    const driver = await adminService.updateDriverById(req.params.id, req.body);
    res.status(200).json({ success: true, data: driver });
});

export const deleteDriver = asyncHandler(async (req: any, res: any) => {
    await adminService.deleteDriverById(req.params.id);
    res.status(200).json({ success: true, data: {} });
});


// Agent Controllers
// FIX: Removed explicit types to allow for correct type inference.
export const createAgent = asyncHandler(async (req: Request, res: Response) => {
    const agent = await adminService.createAgent(req.body);
    res.status(201).json({ success: true, data: agent });
});


// User Controllers
// FIX: Removed explicit types to allow for correct type inference.
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await adminService.getAllUsers();
    res.status(200).json({ success: true, count: users.length, data: users });
});