import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ProductDocument } from '../products/product.document';

export interface SearchResult {
  id: string;
  name: string;
  category: string;
  location?: string;
  score?: number;
}

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) { }


  async autocomplete(term: string): Promise<string[]> {
    try {
      const result = await this.elasticsearchService.search<ProductDocument>({
        index: 'products',
        body: {
          suggest: {
            product_suggest: {
              prefix: term,
              completion: {
                field: 'suggest',
                fuzzy: {fuzziness: 'AUTO'},
                size: 10, // Limitar el número de sugerencias
              }
            }
          }
        }
      });
      
      // Tipo explícito para la respuesta de sugerencias
      const suggest = (result as any).suggest?.product_suggest?.[0]?.options ?? [];
      console.log('🔍 Sugerencias:', suggest);

      return suggest.map((opt: { text: string }) => opt.text);
      
    } catch (error) {
      console.error('Error completo:', error);
      throw new HttpException(
        'Error en autocompletado', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async search(
    query: string,
    category?: string,
    location?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ results: SearchResult[]; total: number }> {
    const from = (page - 1) * limit;
  
    // Construcción dinámica del filtro de búsqueda
    const mustClauses: any[] = [];
  
    if (query) {
      mustClauses.push({
        bool: {
          should: [
            { match_phrase_prefix: { name: { query, boost: 3.0 } } },  // Solo en 'name' que es de tipo 'text'
            { wildcard: { location: { value: `*${query}*`, boost: 2.0 } } },  // Usar 'wildcard' para location y category
            { wildcard: { category: { value: `*${query}*`, boost: 1.5 } } }
          ]
        }
      });
    }
  
    if (category) {
      mustClauses.push({
        term: { category: category }
      });
    }
  
    if (location) {
      mustClauses.push({
        match: { location: location }
      });
    }
  
    const result = await this.elasticsearchService.search<SearchResult>({
      index: 'products',
      from,
      size: limit,
      body: {
        query: {
          bool: {
            must: mustClauses.length > 0 ? mustClauses : [{ match_all: {} }]
          }
        },
        sort: [
          { _score: { order: 'desc' } },
        ]
      }
    });
  
    const total = typeof result.hits.total === 'number'
      ? result.hits.total
      : result.hits.total?.value || 0;
  
    return {
      results: result.hits.hits.map(hit => ({
        ...hit._source,
        id: hit._id,
        score: hit._score
      })),
      total
    };
  }

  async getRelatedSuggestions(query: string): Promise<SearchResult[]> {
    const result = await this.elasticsearchService.search<ProductDocument>({
      index: 'products',
      body: {
        query: {
          bool: {
            should: [
              { wildcard: { name: `*${query.toLowerCase()}*` } },
              { wildcard: { category: `*${query.toLowerCase()}*` } },
              { wildcard: { location: `*${query.toLowerCase()}*` } }
            ]
          }
        }
      }
    });
     
    console.log('Resultado de related-suggestions:', result.hits.hits);  // Para depurar los resultados
  
    return result.hits.hits.map((hit) => ({
      id: hit._id,
      name: hit._source.name,
      category: hit._source.category,
      location: hit._source.location,
      score: hit._score,
    }));
  }

  async resetIndex() {
    try {
      //this.createIndex();
      // Borra el índice si existe
    } catch (error) {
      console.error('Error resetting index:', error.meta?.body?.error);
    }
  }


}