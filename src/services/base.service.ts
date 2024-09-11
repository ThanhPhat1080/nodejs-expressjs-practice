import { refinementReqQuery } from '@/utils/common';
import { Request } from 'express';
import { Document, FilterQuery, Model, modelNames, PopulateOption, PopulateOptions, Query } from 'mongoose';

type GetManyReturnType<T> = {
    data: T[];
    total: number;
    skip: number;
    limit: number;
};

type GetParamOptionsType = {
    populates?: Array<PopulateOptions | (PopulateOptions | string)[]>;
    isExact?: boolean;
    select?: string | string[] | Record<string, number | boolean | string | object>;
    embed?: boolean;
    pagination?: {
        limit?: number;
        page?: number;
        skip?: number;
    };
};

export interface IBaseService<T> {
    getById: (id: string) => Promise<T | null>;
    create: (model: T) => Promise<T>;
    getOne: (criteria: FilterQuery<T>, options: GetParamOptionsType) => Promise<T | null>;
    getMany: (req: FilterQuery<T>, options: GetParamOptionsType) => Promise<GetManyReturnType<T>>;
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

    getOne = async (criteria: FilterQuery<T>, options?: GetParamOptionsType): Promise<T | null> => {
        const { populates = [], isExact = false, select, embed = false } = options;

        const queryBuilder = this.model.findOne(isExact ? criteria : refinementReqQuery(criteria)).select(select);

        if (embed) {
            populates.forEach((populate) => {
                queryBuilder.populate(populate);
            });
        }

        return await queryBuilder.exec();
    };

    getMany = async (criteria: FilterQuery<T>, options?: GetParamOptionsType): Promise<GetManyReturnType<T>> => {
        const {
            populates = [],
            isExact = false,
            select,
            pagination: { limit = 0, page = 0 },
            embed = false,
        } = options;

        let skipNumber = 0;

        if (page > 1) {
            skipNumber = (page - 1) * limit;
        }

        const queryOptions = {
            skip: skipNumber,
            limit,
        };

        const refinementQueries = isExact ? (criteria as FilterQuery<T>) : refinementReqQuery(criteria);
        const queryBuilder = this.model.find(refinementQueries).setOptions(page ? queryOptions : {});

        if (embed) {
            console.log('ruin');
            populates.forEach((populate) => {
                queryBuilder.populate(populate);
            });
        }

        const data = await queryBuilder.select(select).exec();

        const total = await this.model.countDocuments(refinementQueries);

        return {
            data,
            total,
            ...queryOptions,
        };
    };
}

export default BaseService;
