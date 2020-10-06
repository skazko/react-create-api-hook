export interface UseApiMethodReturn<T, A extends Array<any>> {
    data: T | null;
    pending: Boolean;
    error: any;
    fetch: (...args: A) => void;
}

export interface HookSettings<A extends Array<any>> {
    loadImmediately?: Boolean;
    args?: A;
}

export type ApiMethod<T, A extends Array<any>> = (...args: A) => Promise<T>;

export type UseApiHook<T, A extends Array<any>> = (
    settings: HookSettings<A>
) => UseApiMethodReturn<T, A>;
