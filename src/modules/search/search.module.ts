import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { elasticsearchConfig } from '../../config/elasticsearch.config';

@Module({
  imports: [ElasticsearchModule.register(elasticsearchConfig)],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService]
})
export class SearchModule {}