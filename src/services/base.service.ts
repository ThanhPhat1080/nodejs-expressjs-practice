import { refinementReqQuery } from '@/utils/common';
import { Document, FilterQuery, Model, modelNames } from 'mongoose';

export interface IBaseService<T> {
    getById: (id: string) => Promise<T | null>;
    select: (criteria: FilterQuery<T>, isExact: boolean) => Promise<T[]>;
    create: (model: T) => Promise<T>;
    getAll: () => Promise<T[]>;
    getOne: (criteria: FilterQuery<T>) => Promise<T | null>;
}

export class BaseService<T extends Document> implements IBaseService<T> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    getById = async (id: string): Promise<T | null> => {
        return await this.model.findOne({
            _id: id,
        });
    };

    select = async (criteria: FilterQuery<T>, isExact: boolean = false): Promise<T[]> => {
        const query = !isExact ? refinementReqQuery(criteria) : criteria;

        return await this.model.find(query);
    };

    create = async (model: Partial<T>): Promise<T> => {
        try {
            const createdObject = await this.model.create(model);

            return createdObject;
        } catch (error) {
            throw error;
        }
    };

    save = async (model: T): Promise<T> => {
        try {
            const savedObject = await model.save();

            return savedObject;
        } catch (error) {
            throw error;
        }
    };

    getAll = async (): Promise<T[]> => {
        return await this.model.find({});
    };

    getOne = async (criteria: FilterQuery<T>): Promise<T | null> => {
        return await this.model.findOne(criteria);
    };
}

export default BaseService;
