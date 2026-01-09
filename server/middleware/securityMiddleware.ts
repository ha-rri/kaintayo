import { Request, Response, NextFunction } from "express";

/**
 * Recursively sanitizes objects by removing keys starting with '$' or containing '.'
 * Prevents NoSQL Injection (e.g. {$gt: ""}).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sanitize = (obj: any): any => {
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);

  if (typeof obj === "object" && obj !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleanObj: any = {};
    for (const key in obj) {
      // Skip dangerous keys commonly used in MongoDB operators
      if (key.startsWith("$") || key.includes(".")) continue;
      cleanObj[key] = sanitize(obj[key]);
    }
    return cleanObj;
  }
  return obj;
};

export const securityMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body) req.body = sanitize(req.body);

  if (req.query) {
    try {
      const cleanQuery = sanitize(req.query);
      // Safely assign back to query if possible (Express 5 compat)
      Object.assign(req.query, cleanQuery);
    } catch {
      // Ignore setter errors
    }
  }

  if (req.params) {
    try {
      req.params = sanitize(req.params);
    } catch {
      // Ignore
    }
  }

  next();
};
