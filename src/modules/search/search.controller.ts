import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService, SearchResult } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(
    @Query('q') query?: string,
    @Query('category') category?: string,
    @Query('location') location?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<{ results: SearchResult[]; total: number }> {
    return this.searchService.search(query || '', category, location, page, limit);
  }

  @Get('autocomplete')
  @ApiQuery({ name: 'term', required: true })
  async autocomplete(@Query('term') term: string) {
    return this.searchService.autocomplete(term);
  }

  @Get('reset-index')
  async resetIndex() {
    await this.searchService.resetIndex();
    return { message: 'Índice products reiniciado correctamente' };
  }

  @Get('related-suggestions')
  @ApiQuery({ name: 'q', required: true })
  @ApiResponse({ status: 200, description: 'Related search suggestions' })
  async relatedSuggestions(@Query('q') query: string): Promise<SearchResult[]> {
    return this.searchService.getRelatedSuggestions(query);
  }
}