const applyColorBlindType = (type, mode) => {
    const elementsToAdjust = document.querySelectorAll('.color-adjustable');
    
    elementsToAdjust.forEach(element => {
      if (element.tagName.toLowerCase() === 'p') {
        // Adjust text color for paragraphs
        switch (type) {
          case 'protanopia':
            if (mode) {
              adjustTextColorForProtanopia(element);
            } else {
              resetElementStyles(element);
            }
            break;
          case 'deuteranopia':
            if (mode) {
              adjustTextColorForDeuteranopia(element);
            } else {
              resetElementStyles(element);
            }
            break;
          case 'tritanopia':
            if (mode) {
              adjustTextColorForTritanopia(element);
            } else {
              resetElementStyles(element);
            }
            break;
          default:
            resetElementStyles(element);
        }
      } else {
        // Adjust background color for other elements
        switch (type) {
          case 'protanopia':
            if (mode) {
              adjustBackgroundColorForProtanopia(element);
            } else {
              resetElementStyles(element);
            }
            break;
          case 'deuteranopia':
            if (mode) {
              adjustBackgroundColorForDeuteranopia(element);
            } else {
              resetElementStyles(element);
            }
            break;
          case 'tritanopia':
            if (mode) {
              adjustBackgroundColorForTritanopia(element);
            } else {
              resetElementStyles(element);
            }
            break;
          default:
            resetElementStyles(element);
        }
      }
    });
  };
  
  const resetElementStyles = (element) => {
    if (!element.__originalColor && !element.__originalBackgroundColor) {
      return; // Skip if original styles were not stored
    }
    element.style.color = element.__originalColor || '';
    element.style.backgroundColor = element.__originalBackgroundColor || '';
  };
  
  const adjustTextColorForProtanopia = (element) => {
    storeOriginalStyles(element);
    // Apply adjustments for protanopia color blindness
    element.style.color = '#000000'; // Set text color to black
  };
  
  const adjustTextColorForDeuteranopia = (element) => {
    storeOriginalStyles(element);
    // Apply adjustments for deuteranopia color blindness
    element.style.color = '#000000'; // Set text color to black
  };
  
  const adjustTextColorForTritanopia = (element) => {
    storeOriginalStyles(element);
    // Apply adjustments for tritanopia color blindness
    element.style.color = '#000000'; // Set text color to black
  };
  
  const adjustBackgroundColorForProtanopia = (element) => {
    storeOriginalStyles(element);
    // Apply adjustments for protanopia color blindness
    element.style.backgroundColor = '#FFFFCC'; // Example background color for protanopia
  };
  
  const adjustBackgroundColorForDeuteranopia = (element) => {
    storeOriginalStyles(element);
    // Apply adjustments for deuteranopia color blindness
    element.style.backgroundColor = '#FFCCCC'; // Example background color for deuteranopia
  };
  
  const adjustBackgroundColorForTritanopia = (element) => {
    storeOriginalStyles(element);
    // Apply adjustments for tritanopia color blindness
    element.style.backgroundColor = '#CCFFFF'; // Example background color for tritanopia
  };
  
  const storeOriginalStyles = (element) => {
    if (!element.__originalColor && !element.__originalBackgroundColor) {
      element.__originalColor = window.getComputedStyle(element).color || '';
      element.__originalBackgroundColor = window.getComputedStyle(element).backgroundColor || '';
    }
  };
  
  const resetAllElementStyles = () => {
    const elementsToReset = document.querySelectorAll('.color-adjustable');
    elementsToReset.forEach(element => {
      resetElementStyles(element);
    });
  };
  
  export { applyColorBlindType, resetAllElementStyles };