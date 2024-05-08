import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'; // Import appropriate icons

function TextToSpeech() {
  const [elementsToRead, setElementsToRead] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(2); // Start from index 2
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Get all text elements on the page
    const textElements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, div, a, button");

    // Extract text content from each element
    const elementTexts = Array.from(textElements).map((element) => element.innerText.trim());

    setElementsToRead(elementTexts);
  }, []);

  useEffect(() => {
    if (isSpeaking) {
      const currentElement = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, div, a, button")[currentIndex];

      let speechText = "";

      if (currentElement.tagName.toLowerCase() === "div") {
        // If the current element is a div ("<div>"), iterate over its children
        const divChildren = Array.from(currentElement.children);

        divChildren.forEach((child) => {
          let childSpeech = "";

          if (child.tagName.toLowerCase() === "a") {
            // If a child is a link ("<a>")
            childSpeech = "This is a link. " + child.innerText.trim();
          } else {
            // For other children, use the regular text content
            childSpeech = child.innerText.trim();
          }

          // Append the speech for each child
          speechText += childSpeech + ". ";
        });
      } else if (currentElement.tagName.toLowerCase() === "a") {
        // If the current element is a link ("<a>")
        speechText = "This is a link. " + currentElement.innerText.trim();
      } else {
        // For other elements, use the regular text content
        speechText = currentElement.innerText.trim();
      }

      const value = new SpeechSynthesisUtterance(speechText);

      // Find an English voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find((voice) => voice.lang === "en-US");

      if (englishVoice) {
        value.voice = englishVoice;
      }

      value.onend = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(value);
    }
  }, [isSpeaking, currentIndex]);

  const handleReadCurrentClick = () => {
    if (!isSpeaking) {
      setIsSpeaking(true);
    } else {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleReadNextClick = () => {
    if (!isSpeaking && currentIndex < elementsToRead.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsSpeaking(true);
    } else if (!isSpeaking && currentIndex === elementsToRead.length - 1) {
      setIsSpeaking(false);
    }
  };

  const handleReadPrevClick = () => {
    if (!isSpeaking && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsSpeaking(true);
    } else if (!isSpeaking && currentIndex === 0) {
      setCurrentIndex(elementsToRead.length - 1); // Go to the last element
      setIsSpeaking(true);
    }
  };

  return (
    <div>
      
      
      <button
        onClick={handleReadPrevClick}
        disabled={isSpeaking || currentIndex === 2}
        aria-label='read-previous'
      >
        <FontAwesomeIcon icon={faChevronLeft} /> 
      </button>
      <button onClick={handleReadCurrentClick} aria-label='pause'>
        {isSpeaking ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />} 
      </button>
      
      <button
        onClick={handleReadNextClick}
        disabled={isSpeaking || currentIndex === elementsToRead.length - 1}
        aria-label='read-next'
      >
        <FontAwesomeIcon icon={faChevronRight} /> 
      </button>

      
      
    </div>
  );
}

export default TextToSpeech;