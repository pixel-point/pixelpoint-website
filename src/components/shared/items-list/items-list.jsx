import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const ItemsList = ({ className, title, items, isTitleFullWidth }) => (
  <section className={clsx('safe-paddings', className)}>
    <div className="container">
      <h2
        className={clsx(
          'text-4xl font-normal leading-snug lg:max-w-[690px] lg:text-[32px] sm:text-2xl',
          !isTitleFullWidth && 'max-w-[740px]'
        )}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <ul className="grid-gap-x mt-16 grid grid-cols-3 lg:mt-14 md:mt-11 md:block md:space-y-11 sm:mt-10 sm:space-y-10">
        {items.map(({ title, description }, index) => (
          <li className="flex items-start" key={index}>
            <span className="text-2xl font-semibold leading-snug text-red lg:text-xl md:text-2xl sm:text-xl">
              {index + 1}.
            </span>
            <div className="ml-2.5">
              <h3 className="text-2xl font-normal leading-snug lg:text-xl md:text-2xl sm:text-xl">
                {title}
              </h3>
              <p className="sm:text-2.5 mt-3 text-lg lg:mt-2.5 lg:text-base md:mt-3 md:text-lg sm:text-base">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

ItemsList.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  isTitleFullWidth: PropTypes.bool,
};

ItemsList.defaultProps = {
  className: null,
  isTitleFullWidth: false,
};

export default ItemsList;
