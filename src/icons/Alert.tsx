import { FC, SVGProps } from "react";

const Alert: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 4C8 6.20914 6.20914 8 4 8C1.79086 8 0 6.20914 0 4C0 1.79086 1.79086 0 4 0C6.20914 0 8 1.79086 8 4ZM4 1.5C4.27615 1.5 4.5 1.72385 4.5 2V4.5C4.5 4.77615 4.27615 5 4 5C3.72385 5 3.5 4.77615 3.5 4.5V2C3.5 1.72385 3.72385 1.5 4 1.5ZM4 6.5C4.27615 6.5 4.5 6.27615 4.5 6C4.5 5.72385 4.27615 5.5 4 5.5C3.72385 5.5 3.5 5.72385 3.5 6C3.5 6.27615 3.72385 6.5 4 6.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Alert;
