import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Product } from './product.entity';
import { ProductDocument } from './product.document';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  listenTo() {
    return Product;
  }

  async afterInsert(event: InsertEvent<Product>) {
    console.log('📌 Evento de inserción detectado para el producto:', event.entity);
    try {
      await this.indexProduct(event.entity);
      console.log('✅ Producto indexado en Elasticsearch');
    } catch (error) {
      console.error('❌ Error al indexar:', error);
    }
  }

  private async indexProduct(product: Product) {
    const doc: ProductDocument = {
      id: product.id.toString(),
      name: product.name,
      category: product.category,
      location: product.location,
      suggest: {
        input: [product.name, product.category],
        weight: 1
      }
    };

    await this.elasticsearchService.index({
      index: 'products',
      id: doc.id,
      body: doc
    });
  }
}