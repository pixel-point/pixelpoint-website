import React from 'react';

import LogoSvg from 'images/logo.inline.svg';

const Footer = () => (
  <footer className="safe-paddings bg-black ">
    <div className="container py-14 text-white">
      <div className="flex justify-between">
        <div>
          <a href="#">
            <LogoSvg width="143" height="36" />
          </a>
        </div>
        <div className="grid auto-cols-auto grid-flow-col gap-20">
          <nav>
            <ul className="grid gap-8">
              <li>
                <a href="#">Website Design</a>
              </li>
              <li>
                <a href="#">Frontend Development</a>
              </li>
            </ul>
          </nav>
          <nav>
            <ul className="grid gap-8">
              <li>
                <a href="#">Case studies</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
            </ul>
          </nav>
          <nav>
            <ul className="grid gap-8">
              <li>
                <a href="#">Schedule a call</a>
              </li>
              <li>
                <a href="#">Twitter</a>
              </li>
              <li>
                <a href="#">Github</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
