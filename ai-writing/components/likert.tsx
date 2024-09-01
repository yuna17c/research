import React from 'react';

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
    <div className='likert-container'>
      <h2 id='likert-question'>{question}</h2>
      <div className='likert-labels'>
        <p>Not Confident</p>
        <p>Confident</p>
      </div>
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
