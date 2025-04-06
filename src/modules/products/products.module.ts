import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { Product } from './product.entity';
import { ProductSubscriber } from './product.subscriber';
import { elasticsearchConfig } from '../../config/elasticsearch.config';
import { ProductSyncService } from './product-sync.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ElasticsearchModule.register(elasticsearchConfig), // ¡Esto faltaba!
  ],
  providers: [ProductSubscriber, ProductSyncService],
  exports: [TypeOrmModule],
})
export class ProductsModule {}