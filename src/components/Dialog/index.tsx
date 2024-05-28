import React, { FunctionComponent, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const dialog = document.getElementById('dialog');
const close = require('@/assets/images/home/close.png');

interface DialogProps {
  title: string | React.ReactNode;
  visible: boolean;
  button?: string | React.ReactNode;
  link?: string;
  handleClose: () => void;
  handleClick?: () => void;
  wrapStyle?:any
}

const Dialog: FunctionComponent<DialogProps> = ({
  children,
  title,
  visible,
  button,
  link,
  handleClose,
  handleClick,
  wrapStyle,
}) => {
  const element = useRef(document.createElement('div'));

  useEffect(() => {
    dialog.appendChild(element.current);
    return () => {
      dialog.removeChild(element.current);
    };
  }, []);

  return createPortal(
    <div className={'top-dialog ' + (!visible ? 'dialog-hidden' : '')}>
      <div className="top-dialog-wrap" style={wrapStyle}>
        <h5 className="top-dialog-title">{title}</h5>
        <div className="top-dialog-content">{children}</div>

        {button && (
          <button className="top-dailog-button" onClick={handleClick}>
            {link ? (
              <a href={link} target="_blank">
                {button}
              </a>
            ) : (
              button
            )}
          </button>
        )}
        <div className="dialog-close" onClick={handleClose}>
          <img src={close} alt="close" />
        </div>
      </div>
    </div>,
    element.current
  );
};

export default Dialog;
