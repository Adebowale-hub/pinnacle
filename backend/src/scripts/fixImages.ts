import dotenv from 'dotenv';
import connectDB from '../config/database';
import Product from '../models/Product';

dotenv.config();

const fixProductImages = async () => {
    try {
        await connectDB();

        console.log('Fetching all products...');
        const products = await Product.find({});
        console.log(`Found ${products.length} products.`);

        let updatedCount = 0;

        for (const product of products) {
            // Check if it's one of the seed products using our assumed image URLs
            if (product.images && product.images.length > 0 && product.images[0].includes('dpmnihwlh')) {
                // Determine a suitable placeholder image based on category
                let imageUrl = '';

                switch (product.category) {
                    case 'Foodstuff':
                        // Use a generic food placeholder
                        imageUrl = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80';
                        break;
                    case 'Beverages':
                        // Generic beverages/drinks placeholder
                        imageUrl = 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80';
                        break;
                    case 'Cosmetics':
                        // Generic cosmetics/skincare placeholder
                        imageUrl = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80';
                        break;
                    case 'Household Items':
                        // Generic cleaning/household placeholder
                        imageUrl = 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&q=80';
                        break;
                    default:
                        // Fallback generic placeholder
                        imageUrl = 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80';
                }

                // Update the product with the working image URL
                product.images = [imageUrl];
                await product.save();
                updatedCount++;
                console.log(`Updated images for: ${product.name}`);
            }
        }

        console.log(`✅ Successfully updated ${updatedCount} products with working placeholder images!`);
        process.exit(0);
    } catch (error: any) {
        console.error('Error updating products:', error.message);
        process.exit(1);
    }
};

fixProductImages();
