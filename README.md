### Example

```typescript
import React from 'react';
import axios from 'axios';
import { useApi } from 'react-hook-use-api-method';

interface Post {
    id: number;
    title: string;
}

function getPostsMethod() {
    return axios
        .request<Post[]>({
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'GET',
        })
        .then((response) => {
            return response.data;
        });
}

function App() {
    const [posts, getPosts, postsStatus] = useApi<Post[], Parameters<typeof getPostsMethod>>(getPostsMethod);
    const loadPosts = React.useCallback(() => {
        getPosts();
    }, [getPosts]);

    return (
        <div>
            <button disabled={postsStatus.pending} onClick={loadPosts}>
                {postsStatus.pending ? 'Loading...' : 'Load posts'}
            </button>
            <div>
                {postsStatus.error && postsStatus.error.toString()}
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
