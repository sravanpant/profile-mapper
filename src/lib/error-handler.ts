export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;
  
    constructor(message: string, statusCode: number = 500) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export function handleError(error: unknown): { message: string; statusCode: number } {
    if (error instanceof AppError) {
      return {
        message: error.message,
        statusCode: error.statusCode
      };
    }
  
    if (error instanceof Error) {
      return {
        message: error.message,
        statusCode: 500
      };
    }
  
    return {
      message: 'An unknown error occurred',
      statusCode: 500
    };
  }