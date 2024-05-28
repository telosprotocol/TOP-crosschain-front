declare module '*.svg' {
  import React from 'react';
  interface SvgrComponent
    extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}
  const value: SvgrComponent;
  export default value;
}
