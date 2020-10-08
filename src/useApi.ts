import { useState, useCallback, useEffect, useRef } from "react";

export function useApi<T, A extends Array<any>>(
    fetch: (...args: A) => Promise<T>
): [T | null, (...args: A) => void, { error: any; pending: boolean }] {
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

    const start: (...args: A) => void = useCallback(
        (...args) => {
            setPending(true);
            setError(null);
            fetch(...args)
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
        [fetch, isMounted]
    );

    return [data, start, { error, pending }];
}
