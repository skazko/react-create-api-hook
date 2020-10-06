import { useState, useCallback, useEffect, useRef } from "react";
import { UseApiMethodReturn, ApiMethod } from "./types";

export function useApiMethod<T, A extends Array<any>>(
    apiMethod: ApiMethod<T, A>
): UseApiMethodReturn<T, A> {
    const [error, setError] = useState<any>(null);
    const [pending, setPending] = useState(false);
    const [data, setData] = useState<T | null>(null);

    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetch: (...args: A) => void = useCallback(
        (...args) => {
            setPending(true);
            setError(null);
            apiMethod(...args)
                .then((data) => {
                    if (isMounted.current) {
                        setData(data);
                        setPending(false);
                    }
                })
                .catch((e) => {
                    if (isMounted.current) {
                        setError(e);
                        setPending(false);
                    }
                });
        },
        [apiMethod, isMounted]
    );

    return { error, data, fetch, pending };
}
