import React, { useState, useEffect } from "react";

interface BlinkAnimationProps {
  text: string; // The text to display
  color?: string; // The color of the blinking text
  fontSize?: string; // The font size of the text
  delay?: number; // Delay between each blink in milliseconds
  infinite?: boolean; // Whether the blinking effect should loop infinitely
}

const BlinkAnimation: React.FC<BlinkAnimationProps> = ({
  text,
  color = "black", // Default color
  fontSize = "20px", // Default font size
  delay = 500, // Default delay between blinks
  infinite = true, // Default to infinite blinking
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (infinite) {
      interval = setInterval(() => {
        setVisible((prev) => !prev); // Toggle visibility
      }, delay);
    }

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [delay, infinite]);

  return (
    <span
      style={{
        color: visible ? color : "transparent", // Hide text when not visible
        fontSize,
        transition: "visibility 0.2s ease-in-out", // Smooth transition
      }}
    >
      {text}
    </span>
  );
};

export default BlinkAnimation;