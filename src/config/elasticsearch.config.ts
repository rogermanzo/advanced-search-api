import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch';

export const elasticsearchConfig: ElasticsearchModuleOptions = {
  node: `http://${process.env.ES_HOST || 'localhost'}:9200`,
};