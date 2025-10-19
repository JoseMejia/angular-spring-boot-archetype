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

export const EMPTY_PAGE: Page<never> =
  {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
    numberOfElements: 0,
    first: true,
    last: true,
    empty: true
  };
