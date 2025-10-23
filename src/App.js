import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DynamicFilterableList from "./components/DynamicFilterableList";
import PostList from "./components/PostList";
import PaginatedList from "./components/PaginatedList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DynamicFilterableList />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/paginated" element={<PaginatedList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
