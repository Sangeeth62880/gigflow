import { Response } from 'express';

interface ApiResponseData<T> {
  success: boolean;
  message: string;
  data?: T;
}

export class ApiResponse {
  static send<T>(res: Response, statusCode: number, message: string, data?: T): Response {
    const responseBody: ApiResponseData<T> = {
      success: statusCode < 400,
      message,
    };

    if (data !== undefined) {
      responseBody.data = data;
    }

    return res.status(statusCode).json(responseBody);
  }

  static ok<T>(res: Response, message: string, data?: T): Response {
    return ApiResponse.send(res, 200, message, data);
  }

  static created<T>(res: Response, message: string, data?: T): Response {
    return ApiResponse.send(res, 201, message, data);
  }
}
