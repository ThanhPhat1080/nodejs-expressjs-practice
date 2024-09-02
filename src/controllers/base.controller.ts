import { IBaseService } from "@/services/base.service";
import { log } from "console";
import { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";

export class BaseController<
    T,
    S extends IBaseService<T>
> {
    private service: S;
    constructor(service: S) {
        this.service = service;
    }

    getById = async (req: Request, res: Response, next: NextFunction): Promise<Response<T> | undefined> => {
        try {
            const { id } = req.params;

            const foundElement: T | null = await this.service.getById(id);

            if (!foundElement) {
                next(createHttpError.NotFound());
            }

            return res.json(foundElement);
        } catch (error) {
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

export default BaseController;