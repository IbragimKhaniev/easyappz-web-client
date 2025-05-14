import React, { useEffect, useState, memo } from 'react';

interface TypingProps {
  content: string;
}

export const Typing = memo(({ content }: TypingProps) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + content.charAt(index));
      index++;
      if (index >= content.length) {
        clearInterval(interval);
      }
    }, 10); // время между появлением символов (50 мс)

    return () => clearInterval(interval);
  }, [content]);

  return (
    <div>
      {displayedText}
    </div>
  );
});

Typing.displayName = 'Typing';