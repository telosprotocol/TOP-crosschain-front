import React, { FunctionComponent } from 'react';
import { Header, Footer } from '..';

const LayoutWrapper: FunctionComponent = ({ children }) => {
  return (
    <div className="top-wrapper">
      <Header />
      <div className="top-content">{children}</div>
      <Footer />
    </div>
  );
};

export default LayoutWrapper;
