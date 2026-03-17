import { IconProps } from './types';

export default function Search({ 
  size = 24, 
  color = 'currentColor', 
  opacity = 1,
  ...props 
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      {...props}
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 16L20 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
