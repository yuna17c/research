import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <div>
      <label>
        <p><input type="checkbox" checked={checked} onChange={onChange} />
        {label}
        </p>
      </label>
    </div>
  );
};

export default Checkbox;
