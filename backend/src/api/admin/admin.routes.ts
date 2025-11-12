import { Router } from 'express';
import { protect, authorize } from '../../middleware/auth.middleware';
import { 
    createCompany,
    getCompanies,
    updateCompany,
    deleteCompany,
    createAgent,
    getUsers,
    createDriver,
    getDrivers,
    updateDriver,
    deleteDriver,
} from './admin.controller';

const router = Router();

// All routes in this file are protected and for admins only
router.use(protect, authorize('admin'));

// Company management
router.route('/companies')
    .post(createCompany)
    .get(getCompanies);

router.route('/companies/:id')
    .put(updateCompany)
    .delete(deleteCompany);

// Driver management
router.route('/drivers')
    .post(createDriver)
    .get(getDrivers);

router.route('/drivers/:id')
    .put(updateDriver)
    .delete(deleteDriver);

// Agent management
router.route('/agents')
    .post(createAgent);

// User management
router.route('/users')
    .get(getUsers);

export default router;