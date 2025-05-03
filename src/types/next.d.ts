declare module 'next' {
  export interface NextApiRequest {
    body: any;
    query: {
      [key: string]: string | string[];
    };
    cookies: {
      [key: string]: string;
    };
    headers: {
      [key: string]: string | string[];
    };
    method: string;
  }
  
  export interface NextApiResponse {
    status(code: number): NextApiResponse;
    json(data: any): void;
    send(data: any): void;
    end(): void;
  }
} 