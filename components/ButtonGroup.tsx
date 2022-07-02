import React, { useState } from 'react';

const ButtonGroup = ({ buttons, onClick }) => {
  const [clickedId, setClickedId] = useState(0);

  const handleClick = (id) => {
    setClickedId(id);
    onClick(id);
  };

  return (
    <>
      {buttons.map((buttonLabel, i) => (
        <button
          key={i}
          name={buttonLabel}
          onClick={() => handleClick(i)}
          className={i === clickedId ? 'button-group active' : 'button-group'}
        >
          {buttonLabel}
        </button>
      ))}
    </>
  );
};

export default ButtonGroup;
