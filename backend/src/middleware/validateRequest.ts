import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

export const validateRequest = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten(),
      });
    }

    // overwrite with parsed data when available
    const data = result.data as any;

    if (data.body) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).body = data.body;
    }
    if (data.query) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).query = data.query;
    }
    if (data.params) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).params = data.params;
    }

    return next();
  };
};
