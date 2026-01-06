import { Request, Response, NextFunction } from "express";

// Basic Error Interface to avoid 'any'
interface AppError {
  name?: string;
  message?: string;
  stack?: string;
  code?: number;
  value?: string;
  errors?: unknown;
  statusCode?: number;
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const errorObj = err as AppError;
  let error = { ...errorObj };
  error.message = errorObj.message;
  error.name = errorObj.name;

  // Log to console for dev
  console.log(errorObj.stack);

  // Mongoose Bad ObjectId (CastError)
  if (error.name === "CastError") {
    const message = `Resource not found with id of ${error.value}`;
    error = { message, statusCode: 404 };
  }

  // Mongoose Duplicate Key
  if (error.code === 11000) {
    const message = "Duplicate field value entered";
    error = { message, statusCode: 400 };
  }

  // Mongoose Validation Error
  if (error.name === "ValidationError") {
    const message = Object.values(
      (error.errors as Record<string, { message: string }>) || {}
    )
      .map((val: unknown) => (val as { message: string }).message)
      .join(", ");
    error = { message, statusCode: 400 };
  }

  // Zod Validation Error
  if (error.name === "ZodError") {
    // We access errorObj.errors (or .issues) because the spread above might miss them
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zodError = errorObj as any;
    const issues = zodError.issues || zodError.errors || [];

    const message = issues
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((issue: any) => issue.message)
      .join(", ");
    error = { message, statusCode: 400 };
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(error.statusCode || statusCode).json({
    success: false,
    message: error.message || "Server Error",
  });
};
