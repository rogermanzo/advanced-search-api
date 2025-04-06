import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Product } from './product.entity';

@Injectable()
export class ProductSyncService implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async onModuleInit() {
    // 1. Crear el índice con el mapeo correcto
    await this.createIndexIfNotExists();

    // 2. Obtener y sincronizar productos
    const products = await this.dataSource.getRepository(Product).find();
    await this.syncProducts(products);
  }

  private async createIndexIfNotExists() {
    const indexExists = await this.elasticsearchService.indices.exists({
      index: 'products',
    });

    if (!indexExists) {
      await this.elasticsearchService.indices.create({
        index: 'products',
        body: {
          mappings: {
            properties: {
              name: { type: 'text' },
              category: { type: 'keyword' }, // ¡Debe ser keyword para contextos!
              location: { type: 'text' },
              suggest: {
                type: 'completion',
              },
            },
          },
        },
      });
      console.log('✅ Índice creado: products');
    } else {
      console.log('ℹ️ El índice "products" ya existe');
    }
  }

  private async syncProducts(products: Product[]) {
    for (const product of products) {
      try {
        const suggestBody = {
          input: [product.name, product.category],
          weight: product.id,
        };

        await this.elasticsearchService.index({
          index: 'products',
          id: product.id.toString(),
          refresh: true,
          body: {
            name: product.name,
            category: product.category,
            location: product.location,
            suggest: suggestBody,
          },
        });

        console.log(`✅ Producto sincronizado: ${product.name}`);
      } catch (err) {
        console.error(
          `❌ Error en ${product.name}:`,
          err.meta?.body?.error || err.message,
        );
      }
    }
  }
}

