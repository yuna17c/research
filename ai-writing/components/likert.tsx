import React from 'react';

interface LikertScaleProps {
  question: string;
  options: number[];
  value: number | null;
  onValueChange: (value: number) => void;
  label1: string;
  label2: string;
}

const LikertScale: React.FC<LikertScaleProps> = ({ question, options, value, onValueChange, label1, label2 }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = parseInt(event.target.value, 10);
    onValueChange(selectedValue);
  };

  return (
    <div className='likert-container'>
      <div className='likert-labels'>
        <p>{label1}</p>
        <p>{label2}</p>
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
              required
            />
            {option}
          </label>
        ))}
      </div>
      </div>
  );
};

export default LikertScale;
