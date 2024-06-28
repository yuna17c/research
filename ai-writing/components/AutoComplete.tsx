"use client";

import { useState, ChangeEvent } from "react";
import axios from "axios";
import "../app/style_main.css";

const Autocomplete = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 2) {
      const response = await axios.post("/api/autocomplete", { query: e.target.value });
      setSuggestions(response.data.suggestions);
    }
  };

  return (
    <div className='inputContainer'>
      <textarea
        className='inputBox'
        // value={query}
        // onChange={handleChange}
        placeholder="Type something..."
      />
      {/* <ul className='suggestionsList'>
        {suggestions.map((suggestion, index) => (
          <li key={index} className='suggestionItem'>{suggestion}</li>
        ))}
      </ul> */}
    </div>
  );
};
export default Autocomplete;
