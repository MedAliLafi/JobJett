import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont, faAngleDown } from '@fortawesome/free-solid-svg-icons';

const FontStyleControl = ({ fontStyles, toggleFontStyleOptions, showFontStyleOptions, changeFontStyle }) => {
  return (
    <div className="font-style-control">
      <button onClick={toggleFontStyleOptions} title="Font Style" aria-label='font-style-options'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faFont} />
          <FontAwesomeIcon icon={faAngleDown} className="angle-icon" style={{ marginLeft: '5px' }} />
        </div>
      </button>
      {showFontStyleOptions && (
        <div className="font-style-options" style={{ position: 'absolute', top: 0, left: '100%', marginLeft: '10px', display: 'flex', flexDirection: 'column' }}>
          {fontStyles.map((style, index) => (
            <button key={index} onClick={() => changeFontStyle(style)} aria-label='font-change-button'>{style}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FontStyleControl;
