import { useEffect } from "react";
import { useApiMethod } from "./useApiMethod";
import { ApiMethod, UseApiHook } from "./types";

export function createApiHook<T, A extends Array<any>>(
    apiMethod: ApiMethod<T, A>
): UseApiHook<T, A> {
    const hook = (args?: A) => {
        const hookReturn = useApiMethod(apiMethod);
        useEffect(() => {
            if (args) {
                hookReturn.fetch(...args);
            }
        }, []);

        return hookReturn;
    };
    return hook;
}
