interface LoadingProps {
  size?: number;
}

export const Loading = ({ size = 64 }: LoadingProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
    <rect fill="#5889DB" stroke="#5889DB" strokeWidth="15" width="30" height="30" x="25" y="50">
      <animate
        attributeName="y"
        calcMode="spline"
        dur="2s"
        values="50;120;50;"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        begin="-.4s"
      />
    </rect>
    <rect fill="#5889DB" stroke="#5889DB" strokeWidth="15" width="30" height="30" x="85" y="50">
      <animate
        attributeName="y"
        calcMode="spline"
        dur="2s"
        values="50;120;50;"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        begin="-.2s"
      />
    </rect>
    <rect fill="#5889DB" stroke="#5889DB" strokeWidth="15" width="30" height="30" x="145" y="50">
      <animate
        attributeName="y"
        calcMode="spline"
        dur="2s"
        values="50;120;50;"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        begin="0s"
      />
    </rect>
  </svg>
);
