import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStop } from '@fortawesome/free-solid-svg-icons'; // Import appropriate icon

function HoverSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const handleMouseEnter = (event) => {
      if (isSpeaking) {
        return; // Do nothing if already speaking
      }

      const { shiftKey, target } = event;
      if (shiftKey) {
        speakText(target.innerText.trim(), target);
      }
    };

    const speakText = (text, element) => {
      const value = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find((voice) => voice.lang === "en-US");
    
      if (englishVoice) {
        value.voice = englishVoice;
      }
    
      value.onstart = () => {
        // Mark the element being read
        element.style.backgroundColor = "yellow";
        setIsSpeaking(true); // Set speaking state to true
      };
    
      value.onend = () => {
        // Remove the marking when reading ends
        element.style.backgroundColor = ""; // Reset background color
        setIsSpeaking(false); // Set speaking state to false
      };
    
      window.speechSynthesis.speak(value);
    };
    
    

    document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, div, a").forEach((element) => {
      element.addEventListener("mouseenter", handleMouseEnter);
    });

    return () => {
      document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, div, a").forEach((element) => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        // Reset background color when component unmounts
        element.classList.remove("read-aloud");
      });
    };
  }, [isSpeaking]);

  const handleReadCurrentClick = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    
      // Reset background color of all elements with inline style
      document.querySelectorAll("[style*=background-color]").forEach((element) => {
        element.style.backgroundColor = ""; // Reset background color
      });
    }
  };
  

  return (
    <div>
      {/* Button to stop speaking */}
      <button onClick={handleReadCurrentClick} aria-label='stop reading'>
        <FontAwesomeIcon icon={faStop} /> {/* Icon for stop */}
      </button>
      {/* CSS for marking the element */}
      <style>{`
  /* Adjust this CSS to fit your styling needs */
  .read-aloud {
    background-color: yellow !important;
  }
  p.read-aloud, 
  h1.read-aloud, 
  h2.read-aloud, 
  h3.read-aloud, 
  h4.read-aloud, 
  h5.read-aloud, 
  h6.read-aloud, 
  span.read-aloud, 
  div.read-aloud, 
  a.read-aloud {
    background-color: yellow !important;
  }
`}</style>

    </div>
  );
}

export default HoverSpeech;
