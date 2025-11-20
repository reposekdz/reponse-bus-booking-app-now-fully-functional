import * as stationService from './stations.service';
import asyncHandler from '../../utils/asyncHandler';

export const getStations = asyncHandler(async (req, res) => {
    const stations = await stationService.getAllStations();
    res.status(200).json({ success: true, data: stations });
});

export const createStation = asyncHandler(async (req, res) => {
    const station = await stationService.createStation(req.body);
    res.status(201).json({ success: true, data: station });
});

export const updateStation = asyncHandler(async (req, res) => {
    const station = await stationService.updateStation(parseInt(req.params.id), req.body);
    res.status(200).json({ success: true, data: station });
});

export const deleteStation = asyncHandler(async (req, res) => {
    await stationService.deleteStation(parseInt(req.params.id));
    res.status(200).json({ success: true, data: {} });
});