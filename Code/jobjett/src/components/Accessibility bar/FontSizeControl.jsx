import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faUndo } from '@fortawesome/free-solid-svg-icons';

const FontSizeControl = ({ increaseFontSize, decreaseFontSize, resetChanges }) => {
  return (
    <div>
      <button onClick={increaseFontSize} title="Increase Font Size" aria-label='increase size'><FontAwesomeIcon icon={faPlus} /></button>
      <button onClick={decreaseFontSize} title="Decrease Font Size" aria-label='decrease size'><FontAwesomeIcon icon={faMinus} /></button>
      <button onClick={resetChanges} title="Reset Changes" aria-label='reset-size'><FontAwesomeIcon icon={faUndo} /></button>
    </div>
  );
};

export default FontSizeControl;