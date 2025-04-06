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
    { name: 'Wireless Keyboard', category: 'accessories', location: 'Texas' }
  ]);

  console.log('Data seeded!');
}

seed();