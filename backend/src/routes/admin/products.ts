import express from 'express';
import multer from 'multer';
import {
    getAllProductsAdmin,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage
} from '../../controllers/productController';
import { protectAdmin } from '../../middleware/auth';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// All routes are protected by admin authentication
router.use(protectAdmin);

router.get('/', getAllProductsAdmin);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/upload-image', upload.single('image'), uploadProductImage);

export default router;
