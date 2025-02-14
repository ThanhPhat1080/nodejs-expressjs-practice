
declare module 'mongoose' {
    export interface DocumentQuery<T, DocType extends import('mongoose').Document, QueryHelpers = {}> {
        mongooseCollection: {
            name: any;
        };
        cache(option: any): Promise<DocumentQuery<T[], Document> & QueryHelpers>;
        useCache: boolean;
        hashKey: string;
    }

    export type CacheOptions = {
        key?: string;
        expired?: number;
    };

    export interface Query<
        ResultType,
        DocType,
        THelpers = {},
        RawDocType = unknown,
        QueryOp = 'find',
        TInstanceMethods = Record<string, never>,
    > extends DocumentQuery<any, any> {}
}