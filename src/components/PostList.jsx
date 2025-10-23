import React from "react";
import { useFetch } from "../hooks/useFetch";

export default function PostList() {

  const { data, error, loading, retry } = useFetch(
    "https://httpbin.org/delay/2?query=abcd"
  );

  return (
    <div>
      <h2>Posts</h2>
      {loading && <p>Loading…</p>}
      {error && (
        <div>
          <p>Error: {error.message}</p>
          <button onClick={retry}>Retry</button>
        </div>
      )}
      <ul>
        {data && <li>{JSON.stringify(data)}</li>}
      </ul>
    </div>
  );
}
