import React, { useState } from "react";

// Mock API
function fetchPage(page, pageSize = 3) {
  // In real world, fetch(`…?page=${page}&pageSize=${pageSize}`)
  const allPosts = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Post ${i + 1}`,
  }));
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) reject(new Error("Random error occurred")); 
      else {
        const start = (page - 1) * pageSize;
        resolve({
          data: allPosts.slice(start, start + pageSize),
          hasMore: start + pageSize < allPosts.length,
        });
      }
    }, 700);
  });
}

export default function PaginatedList() {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  function loadMore() {
    setLoading(true);
    setError(null);
    fetchPage(page)
      .then(res => {
        setPosts(prev => [...prev, ...res.data]);
        setHasMore(res.hasMore);
        setPage(prev => prev + 1);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }

  // Load first page on mount
  React.useEffect(() => { if (posts.length === 0) loadMore(); }, []);

  return (
    <div>
      <h2>Paginated List (Load More)</h2>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
      {loading && <div>Loading…</div>}
      {error && (
        <div>
          ERROR: {error.message} <button onClick={loadMore}>Retry</button>
        </div>
      )}
      {hasMore && !loading && (
        <button onClick={loadMore}>Load More</button>
      )}
      {!hasMore && <div>No more items.</div>}
    </div>
  );
}
