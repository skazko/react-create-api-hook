export interface UseApiMethodReturn<T, A extends Array<any>> {
    data: T | null;
    pending: Boolean;
    error: any;
    fetch: (...args: A) => void;
}

export type ApiMethod<T, A extends Array<any>> = (...args: A) => Promise<T>;

export type UseApiHook<T, A extends Array<any>> = (
    args?: A
) => UseApiMethodReturn<T, A>;
