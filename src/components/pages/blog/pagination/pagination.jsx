import { navigate } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';

import { BLOG_CATEGORIES } from 'constants/blog';
import getBlogPath from 'utils/get-blog-path';

import Arrow from './images/arrow.inline.svg';

const Pagination = ({ activeCategory, currentPageIndex, pageCount }) => {
  const pageLinkAndBreakLinkClassName =
    'flex justify-center items-center text-base font-normal border-2 border-transparent w-10 h-10 rounded-full transition-colors duration-200 mx-2 hover:text-red sm:w-8 sm:h-8 sm:text-sm sm:mx-px';
  const previousAndNextLinkClassName =
    'flex items-center text-base font-semibold text-red space-x-1.5 transition-colors duration-200 hover:text-blue';

  const handlePageChange = ({ selected }) => {
    navigate(getBlogPath({ category: activeCategory, pageNumber: selected + 1 }));
  };

  return (
    <div className="safe-paddings mt-20 lg:mt-16 md:mt-14">
      <div className="container-md border-t border-t-gray-3 pt-7 dark:border-t-gray-8 sm:pt-5">
        <ReactPaginate
          containerClassName="flex justify-center items-center"
          pageLinkClassName={pageLinkAndBreakLinkClassName}
          breakLinkClassName={pageLinkAndBreakLinkClassName}
          activeLinkClassName="!border-red text-red font-bold"
          previousClassName="mr-auto"
          nextClassName="ml-auto"
          previousLinkClassName={previousAndNextLinkClassName}
          nextLinkClassName={previousAndNextLinkClassName}
          disabledClassName="opacity-0 invisible"
          previousLabel={
            <>
              <Arrow className="w-4 rotate-180 sm:w-4.5" />
              <span className="sm:hidden">Previous</span>
            </>
          }
          nextLabel={
            <>
              <span className="sm:hidden">Next</span>
              <Arrow className="w-4 sm:w-4.5" />
            </>
          }
          forcePage={currentPageIndex}
          pageCount={pageCount}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

Pagination.propTypes = {
  activeCategory: PropTypes.oneOf(BLOG_CATEGORIES),
  currentPageIndex: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
};

Pagination.defaultProps = {
  activeCategory: null,
};

export default Pagination;
