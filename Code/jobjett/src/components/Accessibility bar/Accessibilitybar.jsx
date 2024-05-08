import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdjust, faEye, faChevronLeft, faChevronRight, faFileAlt } from '@fortawesome/free-solid-svg-icons'; // Import appropriate icons
import FontSizeControl from './FontSizeControl';
import FontStyleControl from './FontStyleControl';
import { applyColorBlindType, resetAllElementStyles } from './ColorBlind'; // Import functions from ColorBlindness.js
import HoverSpeech from '../../components/Accessibility bar/HoverSpeech';

import './Accessibilitybar.css'; // Import CSS file for styling

const AccessibilityBar = () => {
  const [originalFontSize, setOriginalFontSize] = useState(11); // Original font size
  const [fontSize, setFontSize] = useState(originalFontSize); // Current font size
  const [fontStyle, setFontStyle] = useState('Arial'); // Default font style
  const [contrast, setContrast] = useState('normal'); // Default contrast
  const [colorBlindMode, setColorBlindMode] = useState(false); // Default color blind mode
  const [showFontStyleOptions, setShowFontStyleOptions] = useState(false); // State to manage visibility of font style options
  const [colorBlindType, setColorBlindType] = useState('normal'); // Default color blindness type
  const [originalTextColors, setOriginalTextColors] = useState({}); // Store original text colors

  const fontStyles = ['Arial', 'Times New Roman', 'Verdana', 'Courier New']; // Add more font styles as needed

  // Function to increase font size
  const increaseFontSize = () => {
    setFontSize(prevSize => prevSize + 1);
  };

  // Function to decrease font size
  const decreaseFontSize = () => {
    setFontSize(prevSize => prevSize - 1);
  };

  // Function to reset font size, font style, contrast, and color blind mode
  const resetChanges = () => {
    setFontSize(originalFontSize);
    setFontStyle('Arial');
    setContrast('normal');
    setColorBlindMode(false);
    setColorBlindType('normal');
    document.body.style.fontFamily = 'Arial';
    resetAllElementStyles(); // Reset all element styles

    // Restore original text colors
    for (const [elementId, originalColor] of Object.entries(originalTextColors)) {
      const element = document.getElementById(elementId);
      if (element) {
        element.style.color = originalColor;
      }
    }
    setOriginalTextColors({});
  };

  // Function to toggle font style options visibility
  const toggleFontStyleOptions = () => {
    setShowFontStyleOptions(!showFontStyleOptions);
  };

  // Function to change font style
  const changeFontStyle = (style) => {
    setFontStyle(style);
    setShowFontStyleOptions(false);
    document.body.style.fontFamily = style;
  };

  // Function to toggle contrast
  const toggleContrast = () => {
    setContrast(contrast === 'normal' ? 'high' : 'normal');
    document.body.style.backgroundColor = contrast === 'normal' ? '#fff' : '#000';
  };

  // Function to toggle color blind mode
  useEffect(() => {
    if (colorBlindMode) {
      // Apply color adjustments for color blindness
      applyColorBlindType(colorBlindType, true);
      // Check all elements and change their text color to black if it's not already black
      const elements = document.querySelectorAll('*');
      const originalColors = {};
      elements.forEach(element => {
        const computedColor = window.getComputedStyle(element).color;
        if (computedColor !== 'rgb(0, 0, 0)' && computedColor !== '#000' && computedColor !== 'black') {
          originalColors[element.id] = computedColor;
          element.style.color = '#000';
        }
      });
      setOriginalTextColors(originalColors);
    } else {
      // Reset color adjustments
      applyColorBlindType('normal', false);
      // Restore original text colors
      for (const [elementId, originalColor] of Object.entries(originalTextColors)) {
        const element = document.getElementById(elementId);
        if (element) {
          element.style.color = originalColor;
        }
      }
      setOriginalTextColors({});
    }
  }, [colorBlindMode, colorBlindType]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  return (
    <div className={`accessibility-bar ${colorBlindMode ? 'colorblind' : ''}`} style={{ color: colorBlindMode ? '#000' : '' }}>
      <FontSizeControl increaseFontSize={increaseFontSize} decreaseFontSize={decreaseFontSize} resetChanges={resetChanges} />
      <FontStyleControl fontStyles={fontStyles} toggleFontStyleOptions={toggleFontStyleOptions} showFontStyleOptions={showFontStyleOptions} changeFontStyle={changeFontStyle} />
     
      
      <HoverSpeech/>

    </div>
  );
};

export default AccessibilityBar;
