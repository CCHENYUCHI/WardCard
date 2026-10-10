import React, { useState, useRef, useEffect } from 'react';

export default function Tooltip({ text, children, position = 'top' }) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!visible) return;
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setVisible(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [visible]);

  if (!text) return children;

  return (
    <span
      ref={containerRef}
      className="custom-tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={(e) => {
        e.stopPropagation();
        setVisible(prev => !prev);
      }}
    >
      {children}
      {visible && (
        <span className={`custom-tooltip-bubble ${position}`} role="tooltip">
          {text}
        </span>
      )}
    </span>
  );
}
