import { Module } from '@nestjs/common';
import { SearchModule } from './modules/search/search.module';
import { ProductsModule } from './modules/products/products.module';
import { DatabaseModule } from './modules/database/database.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,  
    ElasticsearchModule.register({ node: 'http://elasticsearch:9200' }), 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `config/${process.env.NODE_ENV}.env`,
    }),
    ProductsModule, 
    SearchModule  // Este también es global
  ],
})
export class AppModule {}
