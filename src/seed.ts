import { DataSource } from 'typeorm';
import { Product } from './modules/products/product.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'user',
    password: 'pass',
    database: 'products_db',
    entities: [Product],
    synchronize: true,
  });

  await dataSource.initialize();

  const productRepo = dataSource.getRepository(Product);

  await productRepo.insert([
    { name: 'Laptop HP EliteBook', category: 'electronics', location: 'New York' },
    { name: 'MacBook Pro 2023', category: 'electronics', location: 'California' },
    { name: 'Wireless Keyboard', category: 'accessories', location: 'Texas' },
    { name: 'Gaming Mouse', category: 'accessories', location: 'Florida' },
    { name: 'Smartphone Samsung Galaxy S21', category: 'electronics', location: 'California' },
    { name: 'Bluetooth Speaker', category: 'electronics', location: 'Nevada' },
    { name: 'Smartwatch Apple Series 6', category: 'electronics', location: 'New York' },
    { name: 'Wireless Headphones', category: 'accessories', location: 'Texas' },
    { name: '4K Ultra HD TV', category: 'electronics', location: 'Washington' },
    { name: 'Portable Charger', category: 'accessories', location: 'Florida' },
    { name: 'LED Desk Lamp', category: 'accessories', location: 'California' },
    { name: 'Gaming Laptop Dell Alienware', category: 'electronics', location: 'Illinois' },
    { name: 'Sony PlayStation 5', category: 'electronics', location: 'New Jersey' },
    { name: 'Xbox Series X', category: 'electronics', location: 'Michigan' },
    { name: 'Apple iPad Pro', category: 'electronics', location: 'New York' },
    { name: 'Razer Gaming Headset', category: 'accessories', location: 'Texas' },
    { name: 'Bluetooth Earbuds', category: 'accessories', location: 'Florida' },
    { name: 'Canon EOS R5', category: 'electronics', location: 'California' },
    { name: 'Nikon D850', category: 'electronics', location: 'Nevada' },
    { name: 'GoPro Hero 9', category: 'electronics', location: 'Colorado' },
    { name: 'Apple Mac Mini M1', category: 'electronics', location: 'New Jersey' },
    { name: 'Microsoft Surface Laptop 4', category: 'electronics', location: 'Michigan' },
    { name: 'Lenovo ThinkPad X1', category: 'electronics', location: 'Ohio' },
    { name: 'Samsung QLED 8K TV', category: 'electronics', location: 'Arizona' },
    { name: 'JBL Flip 5 Bluetooth Speaker', category: 'electronics', location: 'Texas' },
    { name: 'Garmin Fenix 6', category: 'electronics', location: 'Florida' },
    { name: 'Apple AirPods Max', category: 'accessories', location: 'California' },
    { name: 'Oculus Quest 2 VR', category: 'electronics', location: 'Nevada' },
    { name: 'Google Pixel 6', category: 'electronics', location: 'California' },
    { name: 'Fitbit Charge 5', category: 'electronics', location: 'Florida' },
    { name: 'Sony WH-1000XM4', category: 'accessories', location: 'Texas' },
    { name: 'Roku Streaming Stick 4K', category: 'electronics', location: 'Washington' },
    { name: 'Logitech G Pro X Wireless Mouse', category: 'accessories', location: 'California' },
    { name: 'Apple TV 4K', category: 'electronics', location: 'New York' },
    { name: 'Bose SoundLink Revolve', category: 'electronics', location: 'Nevada' }
  ]);

  console.log('Data seeded!');
}

seed();