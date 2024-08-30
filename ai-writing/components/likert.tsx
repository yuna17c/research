import React, { useState } from 'react';

interface LikertScaleProps {
  question: string;
  options: number[];
  value: number | null;
  onValueChange: (value: number) => void;
}

const LikertScale: React.FC<LikertScaleProps> = ({ question, options, value, onValueChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = parseInt(event.target.value, 10);
    onValueChange(selectedValue);
  };

  return (
    <div className='likertQuestion'>
      <p>{question}</p>
      <div className="likert">
        {options.map((option, index) => (
          <label key={index}>
            <input
              type="radio"
              name={question}
              value={index + 1}
              checked={value === index + 1}
              onChange={handleChange}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default LikertScale;
