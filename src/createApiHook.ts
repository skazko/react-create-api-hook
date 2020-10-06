import { useEffect } from "react";
import { useApiMethod } from "./useApiMethod";
import { HookSettings, ApiMethod, UseApiHook } from "./types";

export function createApiHook<T, A extends Array<any>>(
    apiMethod: ApiMethod<T, A>
): UseApiHook<T, A> {
    const hook = (settings: HookSettings<A>) => {
        const hookReturn = useApiMethod(apiMethod);
        useEffect(() => {
            if (settings.loadImmediately) {
                hookReturn.fetch(...(settings.args as A));
            }
        }, []);

        return hookReturn;
    };
    return hook;
}
