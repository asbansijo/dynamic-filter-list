// src/components/DynamicFilterableList.jsx
import React, { useState, useMemo } from "react";
import { products as mockProducts } from "../mock/mockProducts";
import { useNavigate, useLocation } from "react-router-dom";

// Helper to parse and stringify query params
function useQueryParams() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  function setParams(obj) {
    Object.entries(obj).forEach(([key, val]) => {
      if (val == null || val === "") params.delete(key);
      else params.set(key, val);
    });
    navigate(`?${params.toString()}`);
  }
  return [params, setParams];
}

export default function DynamicFilterableList() {
  const [params, setParams] = useQueryParams();

  // Get initial values from URL or set default
  const [name, setName] = useState(params.get("name") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [price, setPrice] = useState([
    Number(params.get("minPrice") || 0),
    Number(params.get("maxPrice") || 1000),
  ]);

  // Find min/max from products
  const prices = mockProducts.map(p => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  // Filtering logic
  const filtered = useMemo(() => {
    return mockProducts.filter(p => {
      const matchName = p.name.toLowerCase().includes(name.toLowerCase());
      const matchCategory = !category || p.category === category;
      const matchPrice = p.price >= price[0] && p.price <= price[1];
      return matchName && matchCategory && matchPrice;
    });
  }, [name, category, price]);

  // Categories for dropdown
  const categories = [...new Set(mockProducts.map(p => p.category))];

  // Handlers
  function handleNameChange(e) {
    setName(e.target.value);
    setParams({ name: e.target.value, category, minPrice: price[0], maxPrice: price[1] });
  }
  function handleCategoryChange(e) {
    setCategory(e.target.value);
    setParams({ name, category: e.target.value, minPrice: price[0], maxPrice: price[1] });
  }
  function handlePriceChange(e, idx) {
    const val = Number(e.target.value);
    const newPrice = [...price];
    newPrice[idx] = val;
    setPrice(newPrice);
    setParams({ name, category, minPrice: newPrice[0], maxPrice: newPrice[1] });
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Dynamic Filterable List</h2>
      <div>
        <input
          type="text"
          value={name}
          placeholder="Filter by name"
          onChange={handleNameChange}
        />

        <select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div>
          Price: 
          <input
            type="range"
            min={min}
            max={max}
            value={price[0]}
            onChange={e => handlePriceChange(e, 0)}
          />
          Min: {price[0]}
          <input
            type="range"
            min={min}
            max={max}
            value={price[1]}
            onChange={e => handlePriceChange(e, 1)}
          />
          Max: {price[1]}
        </div>
      </div>

      <ul>
        {filtered.length === 0 && <li>No results</li>}
        {filtered.map(item => (
          <li key={item.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
            <strong>{item.name}</strong> ({item.category}) — ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
