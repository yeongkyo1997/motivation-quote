export interface ApiError {
  message: string;
  code?: string;
}

export type ApiResult<T> = 
  | { success: true; data: T }
  | { success: false; error: ApiError };

export interface QuoteResponse extends Array<{result?: string} | {respond?: string}> {}