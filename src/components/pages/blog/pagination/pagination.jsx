import { navigate } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';

import { BLOG_BASE_PATH } from 'constants/blog';
import Arrow from 'images/arrow.inline.svg';

const Pagination = ({ currentPageIndex, pageCount }) => {
  const pageLinkAndBreakLinkClassName =
    'flex justify-center items-center text-base font-normal border-2 border-transparent w-10 h-10 rounded-full transition-colors duration-200 mx-2 hover:text-red sm:w-7 sm:h-7 sm:mx-0.5';
  const previousAndNextLinkClassName =
    'flex items-center text-base font-semibold space-x-1.5 transition-colors duration-200 hover:text-red';

  const handlePageChange = ({ selected }) => {
    const navigatePath = selected === 0 ? BLOG_BASE_PATH : `${BLOG_BASE_PATH}/${selected + 1}`;
    navigate(navigatePath);
  };

  return (
    <div className="safe-paddings mt-10">
      <div className="container-sm">
        <ReactPaginate
          containerClassName="flex justify-center items-center"
          pageLinkClassName={pageLinkAndBreakLinkClassName}
          breakLinkClassName={pageLinkAndBreakLinkClassName}
          activeLinkClassName="!border-red text-red"
          previousClassName="mr-auto"
          nextClassName="ml-auto"
          previousLinkClassName={previousAndNextLinkClassName}
          nextLinkClassName={previousAndNextLinkClassName}
          disabledClassName="opacity-0 invisible"
          previousLabel={
            <>
              <Arrow className="w-4 rotate-180" />
              <span className="sm:hidden">Previous</span>
            </>
          }
          nextLabel={
            <>
              <span className="sm:hidden">Next</span>
              <Arrow className="w-4" />
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
  currentPageIndex: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
};

export default Pagination;
