import express from 'express';
import {
    getProducts,
    getProduct,
    getProductsByCategory
} from '../controllers/productController';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/category/:category', getProductsByCategory);

export default router;
