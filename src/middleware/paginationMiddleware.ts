import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Model } from "mongoose";

const paginationMiddleware = <T> (model: Model<T>) => async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query;
    
    const page = parseInt(query?.page as string || '1');
    const limit = parseInt(query?.limit as string);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let result: any = {
      next: null,
      previous: null,
      data: []
    };
    
    // change model.length to model.countDocuments() because you are counting directly from mongodb
    if (endIndex < (await model.countDocuments().exec())) {
      result.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      result.data = await model.find().limit(limit).skip(startIndex);
      
      res.append('result', result);

      next();
    } catch (e) {
      next(createHttpError.BadRequest(e.message));
    }
};

export default paginationMiddleware