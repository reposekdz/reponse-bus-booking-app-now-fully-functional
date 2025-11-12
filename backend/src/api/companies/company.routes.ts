import { Router } from 'express';
import { getCompanies, getCompanyById } from './company.controller';

const router = Router();

router.route('/')
    .get(getCompanies);

router.route('/:id')
    .get(getCompanyById);

export default router;
