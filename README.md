# createApiHook

createApiHook is a simple way to use API methods in your functional React components.

It's written on TypeScript.

## Features

-   Create custom [hook](https://reactjs.org/docs/hooks-intro.html) to make request to API from [React functional component](https://reactjs.org/docs/components-and-props.html#function-and-class-components)
-   Create a simple object that collect request data and fetch method
-   Work with any async function that returns [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

## Installing

```bash
$ npm install react-hook-use-api-method
```

## Example

Firstly you need api methods. I prefer to keep them in separate folder for example `src/api/api.js`

```javascript
const baseUrl = "https://my-json-server.typicode.com/skazko/demo/beers";

export const getBeer = async (id) => {
    const res = await fetch(baseUrl + "/" + id);
    return await res.json();
};

export const getBeers = async () => {
    const res = await fetch(baseUrl);
    return await res.json();
};
```

Next step is to create hooks. Will keep them in `src/api/hooks.js`

```javascript
import { createApiHook } from "react-hook-use-api-method";
import { getBeers, getBeer } from "./api";

export const useBeers = createApiHook(getBeers);
export const useBeer = createApiHook(getBeer);
```

Now you can use it in components: `src/App.js`

```javascript
import React from "react";
import { useBeers, useBeer } from "./api/hooks";

function App() {
    const beers = useBeers([]);
    const { data: beer, fetch: getBeer, ...status } = useBeer();

    return (
        <div className="container">
            <h1 className="center-align">useApi hook example</h1>
            <div style={{ height: "20px" }}>
                {(beers.pending || status.pending) && (
                    <div className="progress">
                        <div className="indeterminate"></div>
                    </div>
                )}
            </div>
            {beers.error && <span>{beers.error.toString()}</span>}
            {beers.data &&
                beers.data.map(({ title, id }) => (
                    <button
                        style={{ marginRight: "10px" }}
                        className="waves-effect waves-light btn"
                        disabled={status.pending || (beer && beer.id === id)}
                        onClick={() => getBeer(id)}
                        key={id}
                    >
                        {title}
                    </button>
                ))}

            <div>
                {beer ? (
                    <div>
                        <h2>{beer.title}</h2>
                        <ul>
                            <li>
                                <b>Alc: </b> {beer.alc}
                            </li>
                            <li>
                                <b>Original gravity: </b> {beer.og}
                            </li>
                            <li>
                                <b>Price: </b> {beer.price}
                            </li>
                        </ul>
                    </div>
                ) : beers.data ? (
                    "Choose beer"
                ) : (
                    "There are no beers"
                )}
            </div>
        </div>
    );
}

export default App;
```

## createApiHook API

if you want get method to use it later call useApi without args

```javascript
const something = useApi();

//later
something.fetch(args); // args depends on your api method
```

-   `something.fetch` - method to make request
-   `something.data` - data that will be returned from apiMethod, initially null
-   `something.pending` - boolean
-   `something.error` - initially null

if you want to make request rigth after component will be mounted pass an array with arguments to hook, or empty array if api method not required arguments.

```javascript
const another = useAnother([]);
```
