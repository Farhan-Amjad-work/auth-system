import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/http.utils";

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body ?? {});
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues
          .map((e) => {
            const field = e.path.length > 0 ? e.path.join(".") : "field";
            return `${field}: ${e.message}`;
          })
          .join(", ");
        next(new ApiError(400, message));
        return;
      }
      next(err);
    }
  };
};
