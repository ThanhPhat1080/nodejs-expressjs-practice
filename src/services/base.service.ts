import { refinementReqQuery } from '@/utils/common';
import { Request } from 'express';
import { Document, FilterQuery, Model, modelNames, Query } from 'mongoose';

type GetManyReturnType<T> = {
    data: T[],
    total: number,
    skip: number,
    limit: number
};

export interface IBaseService<T> {
    getById: (id: string) => Promise<T | null>;
    create: (model: T) => Promise<T>;
    getOne: (criteria: FilterQuery<T>, options: { populate: string, isExact: boolean }) => Promise<T | null>;
    getMany: (req: Request) => Promise<GetManyReturnType<T>>;
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

    getOne = async (criteria: FilterQuery<T>, options?: { populate: string, isExact: boolean }): Promise<T | null> => {
        const {
            populate = '',
            isExact = false
        } = options;

        const queryBuilder = this.model.findOne(isExact ? criteria : refinementReqQuery(criteria));

        populate.split(',').forEach(field => {
            queryBuilder.populate(field);
        });

        return await queryBuilder.exec();
    };

    getMany = async (req: Request, options?: { populate: string, field: string }): Promise<GetManyReturnType<T>> => {
        let {
            limit = 0,
            page = 0,
            skip = 0,
            ...criteria
        } = req.query;

        const {
            populate = '',
            field = '',
        } = options

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if (pageNumber > 1) {
            skip = (pageNumber - 1) * limitNumber;
        }

        const queryOptions = {
            skip: Number(skip),
            limit: limitNumber
        };
    
        const refinementQueries = refinementReqQuery(criteria);
        const queryBuilder = this.model
          .find(refinementQueries)
          .setOptions(pageNumber ? queryOptions: {});
          
        (populate as string).split(',').forEach((field: string) => {
          queryBuilder.populate(field);
        });
    
        const data = await queryBuilder.exec();

        const total = await this.model.countDocuments(refinementQueries);

        return {
            data,
            total,
            ...options
        };
    }
}

export default BaseService;
