export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page index (0-based)
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
