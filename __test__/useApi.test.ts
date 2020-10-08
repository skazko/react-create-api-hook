import { renderHook, act } from "@testing-library/react-hooks";
import { useApiMethod } from "../src/useApiMethod";

const asyncFunc = () =>
    new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            resolve("Done");
        }, 0);
    });

const errorFunc = () =>
    new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            reject("Error");
        }, 0);
    });

test("should mount and get data from async func", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
        useApiMethod(asyncFunc)
    );

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.pending).toBe(false);

    act(() => {
        result.current.fetch();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.pending).toBe(true);

    await waitForNextUpdate();

    expect(result.current.data).toBe("Done");
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toBeNull();
});

test("should set error", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
        useApiMethod(errorFunc)
    );

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.pending).toBe(false);

    act(() => {
        result.current.fetch();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.pending).toBe(true);

    await waitForNextUpdate();

    expect(result.current.data).toBeNull();
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toBe("Error");
});
