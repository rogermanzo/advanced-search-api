import { SearchResult } from "../search/search.service";

export interface ProductDocument extends SearchResult {
    id: string;
    name: string;
    category: string;
    location?: string;
    suggest: {
      input: string | string[];
      weight?: number;
    };
}