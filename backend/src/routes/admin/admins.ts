import express from 'express';
import {
    getAllAdmins,
    createAdmin,
    deleteAdmin
} from '../../controllers/adminAuthController';
import { protectAdmin, restrictToSuperAdmin } from '../../middleware/auth';

const router = express.Router();

// All routes require super admin
router.use(protectAdmin);
router.use(restrictToSuperAdmin);

router.get('/', getAllAdmins);
router.post('/', createAdmin);
router.delete('/:id', deleteAdmin);

export default router;
