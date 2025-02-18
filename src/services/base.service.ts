import { redisDBConnection } from '@/dataHelpers';
import { getJsonStringify, refinementReqQuery } from '@/utils/common';
import {
    Document,
    FilterQuery,
    IfAny,
    Model,
    PopulateOptions,
    Query,
    QueryOptions,
    Require_id,
    RootFilterQuery,
    UpdateQuery,
} from 'mongoose';

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
    useCache?: boolean;
};

type QueryType<T> = Query<
    IfAny<T, any, Document<unknown, {}, T> & Require_id<T>>,
    IfAny<T, any, Document<unknown, {}, T> & Require_id<T>>,
    {},
    T,
    any,
    {}
>;

export interface IBaseService<T> {
    getById(id: string): QueryType<T>;
    create: (model: T) => Promise<T>;
    getOne: (criteria: FilterQuery<T>, options: GetParamOptionsType) => QueryType<T | null>;
    getMany: (req: FilterQuery<T>, options: GetParamOptionsType) => Promise<GetManyReturnType<T>>;
    save: (model: T) => Promise<T>;
}

export class BaseService<T extends Document> implements IBaseService<T> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    findOneAndUpdate = (filter: RootFilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions<T>) => {
        return this.model.findOneAndUpdate(filter, update, {
            new: true,
            ...(options || {}),
        });
    };

    getById = (id: string) => {
        return this.model.findById(id);
    };

    create = async (modelObj: T): Promise<T> => {
        try {
            const createdObject = await this.model.create(modelObj);

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

    getAll = () => {
        return this.model.find({});
    };

    getOne = (criteria: FilterQuery<T>, options?: GetParamOptionsType) => {
        const { populates = [], isExact = false, select, embed = false } = options;

        const queryBuilder = this.model.findOne(isExact ? criteria : refinementReqQuery(criteria)).select(select);

        if (embed) {
            populates.forEach((populate) => {
                queryBuilder.populate(populate);
            });
        }

        return queryBuilder;
    };

    getMany = async (criteria: FilterQuery<T>, options?: GetParamOptionsType): Promise<GetManyReturnType<T>> => {
        const {
            populates = [],
            isExact = false,
            select,
            pagination: { limit = 0, page = 0 },
            embed = false,
            useCache = false,
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
            populates.forEach((populate) => {
                queryBuilder.populate(populate);
            });
        }
        let data = [];

        if (useCache) {
            const cacheKey = getJsonStringify(
                Object.assign({}, queryBuilder.getQuery(), { collection: this.model.collection.name }),
            );
            const cacheValue = await redisDBConnection.client.get(cacheKey);

            if (cacheValue) {
                data = JSON.parse(cacheValue.toString());
            }
        }

        if (!data || !data.length) {
            let query = () => (useCache ? queryBuilder.select(select).cache() : queryBuilder.select(select));

            data = await query();
        }

        const total = await this.model.countDocuments(refinementQueries);

        return {
            data,
            total,
            ...queryOptions,
        };
    };
}

export default BaseService;

