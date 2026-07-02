import * as React from 'react';

export default function FirefliesLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      className={className}
    >
      <path
        d='M8.91742 3.00006H3V8.87408H8.91742V3.00006Z'
        fill='currentColor'
      />
      <path
        d='M15.9267 3H10.0093V8.87401H20.9996V8.03465C20.9994 6.69933 20.465 5.41877 19.5137 4.4746C18.5625 3.53043 17.2724 3 15.9272 3H15.9267Z'
        fill='currentColor'
      />
      <path
        d='M3 10.0914V15.9654C3.00014 17.3007 3.53461 18.5813 4.48584 19.5255C5.43708 20.4696 6.72718 21 8.07237 21H8.91743V10.0914H3Z'
        fill='currentColor'
      />
      <path
        d='M15.9267 10.0914H10.0093V15.9654H15.9267V10.0914Z'
        fill='currentColor'
      />
    </svg>
  );
}
