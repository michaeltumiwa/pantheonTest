import { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string; // The text to display
  delay: number; // Delay between each character in milliseconds
  infinite?: boolean; // Whether the typing effect should loop infinitely
}

const Typewriter: React.FC<TypewriterProps> = ({ text, delay, infinite = false }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timeout: number;

    if (currentIndex <= text.length) {
      timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
    } else if (infinite) {
      setCurrentIndex(0);
      setCurrentText('');
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, delay, infinite, text]);

  return <span>{currentText}</span>;
};

export default Typewriter;