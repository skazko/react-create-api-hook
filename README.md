## Usage

```tsx
const [data, getData, status] = useApi(yourApiMethod);
```

`yourApiMethod` - a function that make request, should return Promise;

`data` - data you want to get;

`getData` - function that shoukd be invoked to start data fetching;

`status.pending` - pending indicator (boolean);

`status.error` - null if no errors

## Example

```tsx
import React from "react";
import axios from "axios";
import { useApi } from "react-hook-use-api-method";

interface Post {
    id: number;
    title: string;
}

function getPostsMethod(args: string) {
    // You can use fetch or any function that return promise
    return axios
        .request<Post[]>({
            // request config
        })
        .then((response) => {
            return response.data;
        });
}

function App() {
    const [posts, getPosts, status] = useApi(getPostsMethod);
    const loadPosts = React.useCallback(() => {
        // pass args for api method
        getPosts("any args if needed");
    }, [getPosts]);

    return (
        <div>
            <button disabled={status.pending} onClick={loadPosts}>
                {status.pending ? "Loading..." : "Load posts"}
            </button>
            <div>
                {status.error && status.error.toString()}
                {posts ? (
                    posts.map((post) => (
                        <div key={post.id}>
                            <h2>{post.title}</h2>
                        </div>
                    ))
                ) : (
                    <div>You have no posts</div>
                )}
            </div>
        </div>
    );
}

export default App;
```
