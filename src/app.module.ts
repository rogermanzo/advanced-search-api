import { Module } from '@nestjs/common';
import { SearchModule } from './modules/search/search.module';
import { ProductsModule } from './modules/products/products.module';
import { DatabaseModule } from './modules/database/database.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [DatabaseModule,  
    ElasticsearchModule.register({ node: 'http://elasticsearch:9200',}),
    ProductsModule, SearchModule],
})
export class AppModule {}