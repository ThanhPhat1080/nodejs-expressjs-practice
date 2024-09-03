import { FilterQuery } from 'mongoose';

function refinementReqQuery<T>(query: FilterQuery<T>, isSearch: boolean = true): FilterQuery<T> {
    return Object.assign(
        {},
        Object.fromEntries(
            isSearch
                ? Object.entries(query)
                      .filter(([key, value]) => value !== undefined)
                      .map(([key, value]) => [key, new RegExp(value, 'g')])
                : Object.entries(query).filter(([key, value]) => value !== undefined),
        ),
    ) as FilterQuery<T>;
}

export { refinementReqQuery };
