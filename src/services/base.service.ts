import { refinementReqQuery } from "@/utils/common";
import { Document, FilterQuery, Model } from "mongoose";

export interface IBaseService<T> {
    getById: (id: string) => Promise<T | null>,
    select: (criteria: FilterQuery<T>) => Promise<T[]>,
    create: (model: T) => Promise<T>,
    getAll: () => Promise<T[]>

}

export class BaseService<T extends Document> implements IBaseService<T> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    getById = async (id: string): Promise<T | null> => {
        return await this.model.findOne({
            "_id": id
        });
    }

    select = async (criteria: FilterQuery<T>): Promise<T[]> => {
        const refinementQuery = refinementReqQuery(criteria);

        return await this.model.find(refinementQuery);
    }

    create = async (model: Partial<T>): Promise<T> => {
        try {
            const createdObject = await this.model.create(model);

            return createdObject;
        } catch (error) {
            throw error;
        }
    }

    getAll = async (): Promise<T[]> => {
        return await this.model.find({});
    }
}

export default BaseService;