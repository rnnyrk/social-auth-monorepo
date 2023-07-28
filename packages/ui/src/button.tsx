import * as React from 'react';

export interface ButtonProps {
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Button({ text, onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      <span>{text}</span>
    </button>
  );
}
