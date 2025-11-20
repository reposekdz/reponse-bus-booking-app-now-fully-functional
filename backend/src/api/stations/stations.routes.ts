import { Router } from 'express';
import { protect, authorize } from '../../middleware/auth.middleware';
import { getStations, createStation, updateStation, deleteStation } from './stations.controller';

const router = Router();

// Publicly accessible to fetch stations for dropdowns
router.get('/', getStations);

// Protected CRUD for Admin
router.use(protect, authorize('admin'));
router.post('/', createStation);
router.put('/:id', updateStation);
router.delete('/:id', deleteStation);

export default router;