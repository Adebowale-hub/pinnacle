import dotenv from 'dotenv';
import connectDB from '../config/database';
import Product from '../models/Product';

dotenv.config();

const seedProducts = async () => {
    try {
        await connectDB();

        // Check if products already exist
        const count = await Product.countDocuments();
        if (count > 0) {
            console.log(`❌ Database already has ${count} products. Skipping seed.`);
            console.log('To re-seed, delete existing products first.');
            process.exit(0);
        }

        const products = [
            // Foodstuff
            {
                name: 'Golden Penny Semovita 2kg',
                description: 'Premium quality semolina flour for making smooth, lump-free swallow. Perfect for Nigerian meals.',
                category: 'Foodstuff',
                retailPrice: 2800,
                wholesalePrice: 2500,
                stock: 150,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/semovita.jpg'],
                isAvailable: true
            },
            {
                name: 'Mama Gold Rice 5kg',
                description: 'Premium long grain parboiled rice. Clean, stone-free, and perfect for jollof, fried rice, and white rice.',
                category: 'Foodstuff',
                retailPrice: 7500,
                wholesalePrice: 7000,
                stock: 200,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/rice.jpg'],
                isAvailable: true
            },
            {
                name: 'Dangote Sugar 1kg',
                description: 'Pure refined white sugar. Essential kitchen staple for beverages and cooking.',
                category: 'Foodstuff',
                retailPrice: 1200,
                wholesalePrice: 1050,
                stock: 300,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/sugar.jpg'],
                isAvailable: true
            },
            {
                name: 'Devon King\'s Vegetable Oil 3L',
                description: 'High quality vegetable cooking oil. Cholesterol-free and perfect for all types of cooking.',
                category: 'Foodstuff',
                retailPrice: 5500,
                wholesalePrice: 5000,
                stock: 120,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/oil.jpg'],
                isAvailable: true
            },
            {
                name: 'Indomie Instant Noodles (Carton)',
                description: 'Carton of 40 packs of Indomie instant noodles. Nigeria\'s favourite noodles brand.',
                category: 'Foodstuff',
                retailPrice: 6800,
                wholesalePrice: 6200,
                stock: 80,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/indomie.jpg'],
                isAvailable: true
            },

            // Beverages
            {
                name: 'Peak Milk Tin 400g',
                description: 'Premium full cream powdered milk. Rich, creamy taste for tea, cereal, and cooking.',
                category: 'Beverages',
                retailPrice: 2500,
                wholesalePrice: 2200,
                stock: 180,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/peak-milk.jpg'],
                isAvailable: true
            },
            {
                name: 'Milo Beverage 500g',
                description: 'Nestle Milo chocolate malt energy drink. Fortified with vitamins and minerals.',
                category: 'Beverages',
                retailPrice: 3200,
                wholesalePrice: 2900,
                stock: 100,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/milo.jpg'],
                isAvailable: true
            },
            {
                name: 'Coca-Cola 50cl (Pack of 12)',
                description: 'Pack of 12 bottles of Coca-Cola. Refreshing carbonated soft drink.',
                category: 'Beverages',
                retailPrice: 3000,
                wholesalePrice: 2700,
                stock: 90,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/cocacola.jpg'],
                isAvailable: true
            },
            {
                name: 'Lipton Yellow Label Tea (100 bags)',
                description: 'Premium quality tea bags for a smooth, refreshing cup of tea.',
                category: 'Beverages',
                retailPrice: 1800,
                wholesalePrice: 1600,
                stock: 140,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/lipton.jpg'],
                isAvailable: true
            },
            {
                name: 'Nescafe Classic Coffee 200g',
                description: 'Instant coffee made from quality Robusta beans. Rich aroma and smooth taste.',
                category: 'Beverages',
                retailPrice: 3500,
                wholesalePrice: 3100,
                stock: 70,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/nescafe.jpg'],
                isAvailable: true
            },

            // Cosmetics
            {
                name: 'Nivea Body Lotion 400ml',
                description: 'Nourishing body lotion with deep moisture serum. Keeps skin soft and smooth all day.',
                category: 'Cosmetics',
                retailPrice: 3800,
                wholesalePrice: 3400,
                stock: 65,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/nivea.jpg'],
                isAvailable: true
            },
            {
                name: 'Dettol Antiseptic 500ml',
                description: 'Trusted antiseptic liquid for wound cleaning, bathing, and household disinfection.',
                category: 'Cosmetics',
                retailPrice: 2200,
                wholesalePrice: 1900,
                stock: 110,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/dettol.jpg'],
                isAvailable: true
            },
            {
                name: 'Closeup Toothpaste 140ml',
                description: 'Gel toothpaste with antibacterial mouthwash for fresh breath and strong teeth.',
                category: 'Cosmetics',
                retailPrice: 850,
                wholesalePrice: 700,
                stock: 200,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/closeup.jpg'],
                isAvailable: true
            },
            {
                name: 'Dark & Lovely Hair Relaxer',
                description: 'Professional strength hair relaxer for smooth, manageable hair.',
                category: 'Cosmetics',
                retailPrice: 2500,
                wholesalePrice: 2200,
                stock: 45,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/dark-lovely.jpg'],
                isAvailable: true
            },

            // Household Items
            {
                name: 'Harpic Toilet Cleaner 500ml',
                description: 'Powerful toilet cleaning liquid. Removes stains and kills 99.9% of germs.',
                category: 'Household Items',
                retailPrice: 1500,
                wholesalePrice: 1300,
                stock: 130,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/harpic.jpg'],
                isAvailable: true
            },
            {
                name: 'Omo Detergent 1kg',
                description: 'Multi-active cleaning detergent powder. Removes tough stains in one wash.',
                category: 'Household Items',
                retailPrice: 1200,
                wholesalePrice: 1000,
                stock: 170,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/omo.jpg'],
                isAvailable: true
            },
            {
                name: 'Morning Fresh Dish Wash 900ml',
                description: 'Concentrated dishwashing liquid. Cuts through grease for sparkling clean dishes.',
                category: 'Household Items',
                retailPrice: 1800,
                wholesalePrice: 1500,
                stock: 95,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/morning-fresh.jpg'],
                isAvailable: true
            },
            {
                name: 'Ariel Detergent 2kg',
                description: 'Premium quality washing detergent. Brilliant clean and fresh scent.',
                category: 'Household Items',
                retailPrice: 2800,
                wholesalePrice: 2500,
                stock: 85,
                images: ['https://res.cloudinary.com/dpmnihwlh/image/upload/v1/pinnacle-supermarket/products/ariel.jpg'],
                isAvailable: true
            }
        ];

        const created = await Product.insertMany(products);
        console.log(`✅ Successfully seeded ${created.length} products!`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Categories:');
        console.log('  Foodstuff: 5 products');
        console.log('  Beverages: 5 products');
        console.log('  Cosmetics: 4 products');
        console.log('  Household Items: 4 products');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (error: any) {
        console.error('Error seeding products:', error.message);
        process.exit(1);
    }
};

seedProducts();
