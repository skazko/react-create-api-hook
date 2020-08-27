import { renderHook, act } from "@testing-library/react-hooks";
import { useApi } from "../src/useApi";

const asyncFunc = () =>
    new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            resolve("Done");
        }, 100);
    });

const errorFunc = () =>
    new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            reject("Error");
        }, 100);
    });

test("should mount and get data from async func", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useApi(asyncFunc));

    expect(result.current[0]).toBeNull();
    expect(result.current[2].error).toBeNull();
    expect(result.current[2].pending).toBe(false);

    act(() => {
        result.current[1]();
    });

    expect(result.current[2].error).toBeNull();
    expect(result.current[2].pending).toBe(true);

    await waitForNextUpdate();

    expect(result.current[0]).toBe("Done");
    expect(result.current[2].pending).toBe(false);
    expect(result.current[2].error).toBeNull();
});

test("should set error", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useApi(errorFunc));

    expect(result.current[0]).toBeNull();
    expect(result.current[2].error).toBeNull();
    expect(result.current[2].pending).toBe(false);

    act(() => {
        result.current[1]();
    });

    expect(result.current[2].error).toBeNull();
    expect(result.current[2].pending).toBe(true);

    await waitForNextUpdate();

    expect(result.current[0]).toBeNull();
    expect(result.current[2].pending).toBe(false);
    expect(result.current[2].error).toBe("Error");
});
