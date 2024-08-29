import { Document, FilterQuery, Model } from "mongoose";

export interface IBaseService<T> {
    get: (criteria: FilterQuery<T>) => Promise<T | null>,
    select: (criteria: FilterQuery<T>) => Promise<T[]>,
    create: (model: T) => Promise<T>
}

export class BaseService<T extends Document> implements IBaseService<T> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    get = async (criteria: FilterQuery<T>): Promise<T | null> => {
        return await this.model.findOne(criteria);
    }

    select = async (criteria: FilterQuery<T>): Promise<T[]> => {
        return await this.model.find(criteria);
    }

    create = async (model: Partial<T>): Promise<T> => {
        try {
            const createdObject = await this.model.create(model);

            return createdObject;
        } catch(error) {
            throw error;
        }
    }
}

export default BaseService;