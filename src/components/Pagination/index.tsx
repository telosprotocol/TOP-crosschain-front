import React from 'react';
import './index.less';

function calPages(current, maxPage) {
  if (maxPage <= 5) {
    if (maxPage === 1) {
      return [1];
    }
    if (maxPage === 2) {
      return [1, 2];
    }
    if (maxPage === 3) {
      return [1, 2, 3];
    }
    if (maxPage === 4) {
      return [1, 2, 3, 4];
    }
    return [1, 2, 3, 4, 5];
  } else {
    if (current === 1) {
      return [1, 2, 3, -1, maxPage];
    }
    if (current === 2) {
      return [1, 2, 3, -1, maxPage];
    }
    if (current === 3) {
      return [1, 2, 3, 4, -1, maxPage];
    }
    if (current === maxPage) {
      return [1, -1, maxPage - 2, maxPage - 1, maxPage];
    }
    if (current === maxPage - 1) {
      return [1, -1, maxPage - 2, maxPage - 1, maxPage];
    }
    if (current === maxPage - 2) {
      return [1, -1, maxPage - 3, maxPage - 2, maxPage - 1, maxPage];
    }
    return [1, -1, current - 1, current, current + 1, -1, maxPage];
  }
}

interface PageProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (v: number) => void;
}
const Pagination: React.FunctionComponent<PageProps> = ({
  current,
  total,
  pageSize = 10,
  onChange,
}) => {
  const maxPage: number =
    total / pageSize === Math.floor(total / pageSize)
      ? total / pageSize
      : Math.floor(total / pageSize) + 1;

  const pages = calPages(current, maxPage);
  return (
    <div className="Pagination">
      <span
        onClick={() => {
          if (current === 1) {
            return;
          }
          onChange(1);
        }}
        className={current === 1 ? 'disable' : ''}
      >
        {'<'}
      </span>
      {pages.map(item => {
        return item !== -1 ? (
          <span
            className={item === current ? 'select' : ''}
            key={item}
            onClick={() => onChange(item)}
          >
            {item}
          </span>
        ) : (
          <span className="dot">•••</span>
        );
      })}
      {/* <span >1</span>
      
      <span>3</span>
      
      <span>4</span> */}
      <span
        onClick={() => {
          if (current === maxPage) {
            return;
          }
          onChange(maxPage);
        }}
        className={current === maxPage ? 'disable' : ''}
      >
        {'>'}
      </span>
    </div>
  );
};

export default Pagination;
