import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';

const mockElasticsearchService = {
  search: jest.fn(),
};

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: ElasticsearchService,
          useValue: mockElasticsearchService,
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('autocomplete', () => {
    it('should return suggestions', async () => {
      const mockResult = {
        suggest: {
          product_suggest: [
            {
              options: [
                { text: 'Laptop HP' },
                { text: 'Laptop Dell' },
              ],
            },
          ],
        },
      };

      mockElasticsearchService.search.mockResolvedValueOnce(mockResult);

      const suggestions = await service.autocomplete('lap');
      expect(suggestions).toEqual(['Laptop HP', 'Laptop Dell']);
    });
  });

  describe('search', () => {
    it('should return search results', async () => {
      const mockResult = {
        hits: {
          total: { value: 1 },
          hits: [
            {
              _id: '1',
              _score: 1.0,
              _source: {
                name: 'Laptop HP',
                category: 'electronics',
                location: 'NY',
              },
            },
          ],
        },
      };

      mockElasticsearchService.search.mockResolvedValueOnce(mockResult);

      const results = await service.search('laptop', undefined, undefined, 1, 10);

      expect(results.total).toBe(1);
      expect(results.results[0].name).toBe('Laptop HP');
    });
  });
});
