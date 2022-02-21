import { motion } from 'framer-motion';
import React from 'react';

const items = [
  {
    name: 'Performance',
    value: '93',
  },
  {
    name: 'Accessibility',
    value: '100',
  },
  {
    name: 'Best practices',
    value: '92',
  },
  {
    name: 'SEO',
    value: '99',
  },
];

const Lighthouse = () => (
  <section className="safe-paddings mt-52">
    <div className="container">
      <h2 className="mx-auto max-w-[1008px] text-center text-6xl font-normal leading-snug">
        Always in the upper <span className="text-red">Lighthouse</span> threshold to outperform
        competitors
      </h2>
      <ul className="mt-16 flex justify-center space-x-44">
        {items.map(({ name, value }, index) => (
          <li key={index}>
            <div className="relative h-36 w-36">
              <div
                className="h-36 w-36 rounded-full border-[6px] border-green border-opacity-20"
                aria-hidden
              />
              <svg
                className="absolute top-1/2 left-1/2"
                width="144"
                height="144"
                viewBox="0 0 144 144"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: 'scale(1, -1) rotate(-90deg) translate(-50%, -50%)' }}
                aria-hidden
              >
                <motion.path
                  className="stroke-green"
                  d="M3.49609 72.0001C3.49609 109.834 34.1664 140.504 72.0001 140.504C109.834 140.504 140.504 109.834 140.504 72.0001C140.504 34.1664 109.834 3.49609 72.0001 3.49609C34.1664 3.49609 3.49609 34.1664 3.49609 72.0001Z"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: value / 100, transition: { duration: 2 } }}
                />
              </svg>
              <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-5xl font-normal">
                {value}
              </span>
            </div>
            <div className="mt-4 text-center font-normal">{name}</div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Lighthouse;
