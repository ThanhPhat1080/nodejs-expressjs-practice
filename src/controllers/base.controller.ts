import { IBaseService } from "@/services/base.service";
import { NextFunction, Response , Request} from "express";
import createHttpError from "http-errors";
import { FilterQuery } from "mongoose";

export class BaseController<
    T,
    S extends IBaseService<T>
> {
    private service: S;
    constructor(service: S) {
        this.service = service;
    }

    get = async (req: Request, res: Response, next: NextFunction): Promise<Response<T> | undefined> => {
        try {
            const queryCriteria = req.params as FilterQuery<T>;

            const foundElement: T | null = await this.service.get(queryCriteria);
            
            if (!foundElement) {
                next(createHttpError.NotFound());
            }

            return res.json(foundElement);
        } catch(error) {
            next(error);
        }
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<Response<T> | undefined> => {
        try {
            const newObject = req.body;
            const createdObject = await this.service.create(newObject);

            return res.json(createdObject);
        } catch (error) {
            next(error);
        }
    }
}