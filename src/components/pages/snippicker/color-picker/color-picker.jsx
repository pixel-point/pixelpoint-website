import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const white = '#ffffff';

const ColorPickerNew = ({ value, onChange }) => (
  <div className="mb-3 flex items-center">
    <input
      className={clsx(
        'relative h-8 w-8 overflow-hidden rounded-sm transition-colors duration-200 before:absolute before:h-8 before:w-8 before:rounded-sm before:border hover:cursor-pointer',
        value === white ? 'before:border-[#E6E6E6]' : 'before:border-transparent'
      )}
      style={{ backgroundColor: value }}
      type="color"
      value={value}
      onChange={onChange}
    />
    <span className="ml-2.5 text-center text-xs leading-denser">{value}</span>
  </div>
);

ColorPickerNew.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ColorPickerNew;
