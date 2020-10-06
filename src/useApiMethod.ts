import { useState, useCallback, useEffect, useRef } from "react";

interface ApiData<T, A extends Array<any>> {
    data: T | null;
    pending: boolean;
    error: any;
    fetch: (...args: A) => void;
}

export function useApiMethod<T, A extends Array<any>>(
    apiMethod: (...args: A) => Promise<T>
): ApiData<T, A> {
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
