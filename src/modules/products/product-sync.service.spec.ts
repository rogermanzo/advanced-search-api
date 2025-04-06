import { Test, TestingModule } from '@nestjs/testing';
import { ProductSyncService } from './product-sync.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { DataSource, Repository } from 'typeorm';
import { Product } from './product.entity';

// Mockeo manual de los servicios
const mockElasticsearchService = {
  indices: {
    exists: jest.fn(),
    create: jest.fn(),
  },
  index: jest.fn(),
};

const mockProductRepo = {
  find: jest.fn(),
};

const mockDataSource = {
  getRepository: jest.fn().mockReturnValue(mockProductRepo),
};

describe('ProductSyncService', () => {
  let service: ProductSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductSyncService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: ElasticsearchService,
          useValue: mockElasticsearchService,
        },
      ],
    }).compile();

    service = module.get<ProductSyncService>(ProductSyncService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should create index if not exists and sync products', async () => {
      mockElasticsearchService.indices.exists.mockResolvedValue(false);
      mockElasticsearchService.indices.create.mockResolvedValue({});
      
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Laptop HP',
          category: 'electronics',
          location: 'New York',
        } as Product,
      ];

      mockProductRepo.find.mockResolvedValue(mockProducts);
      mockElasticsearchService.index.mockResolvedValue({});

      await service.onModuleInit();

      expect(mockElasticsearchService.indices.exists).toHaveBeenCalledWith({
        index: 'products',
      });

      expect(mockElasticsearchService.indices.create).toHaveBeenCalled();

      expect(mockElasticsearchService.index).toHaveBeenCalledWith({
        index: 'products',
        id: '1',
        refresh: true,
        body: {
          name: 'Laptop HP',
          category: 'electronics',
          location: 'New York',
          suggest: {
            input: ['Laptop HP', 'electronics'],
            weight: 1,
          },
        },
      });
    });

    it('should skip creating index if already exists', async () => {
      mockElasticsearchService.indices.exists.mockResolvedValue(true);
      mockProductRepo.find.mockResolvedValue([]);
      mockElasticsearchService.index.mockResolvedValue({});

      await service.onModuleInit();

      expect(mockElasticsearchService.indices.create).not.toHaveBeenCalled();
    });
  });
});
