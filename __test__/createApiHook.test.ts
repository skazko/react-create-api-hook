import { renderHook, act } from "@testing-library/react-hooks";
import { createApiHook } from "../src/createApiHook";

const data = {
    "1": { value: "first" },
    "2": { value: "second" },
};

const getData = () =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data);
        }, 0);
    });

const getValue = (id: keyof typeof data) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id in data) {
                resolve(data[id].value);
            } else {
                reject("Error");
            }
        }, 0);
    });

test("createApiHook tests not immediate", async () => {
    const useData = createApiHook(getData);
    const { result, waitForNextUpdate } = renderHook(() => useData());

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.pending).toBe(false);

    act(() => {
        result.current.fetch();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.pending).toBe(true);

    await waitForNextUpdate();

    expect(result.current.data).toHaveProperty("1", { value: "first" });
    expect(result.current.data).toHaveProperty("2", { value: "second" });
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toBeNull();
});

test("createApiHook tests immediate", async () => {
    const useData = createApiHook(getData);
    const { result, waitForNextUpdate } = renderHook(() => useData([]));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.pending).toBe(true);

    await waitForNextUpdate();

    expect(result.current.data).toHaveProperty("1", { value: "first" });
    expect(result.current.data).toHaveProperty("2", { value: "second" });
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toBeNull();
});

test("createApiHook tests immediate should get value", async () => {
    const useData = createApiHook(getValue);
    const { result, waitForNextUpdate } = renderHook(() => useData(["1"]));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.pending).toBe(true);

    await waitForNextUpdate();

    expect(result.current.data).toBe("first");
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toBeNull();
});
