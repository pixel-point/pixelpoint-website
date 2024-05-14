import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Card from './card';

const stats = [
  {
    amount: '500K+',
    title: 'Project views',
  },
  {
    amount: '3k+',
    title: 'Github stars',
  },
];

const data = [
  {
    url: 'https://twitter.com/alex_barashkov/status/1705118860444147782?s=20',
    name: 'Alex Barashkov',
    nickname: 'alex_barashkov',
    followers: '',
    avatar: (
      <StaticImage
        src="./images/avatar-alex-barashkov.png"
        alt="Alex Barashkov's avatar"
        width={36}
        height={36}
      />
    ),
    text: (
      <>
        <span>~600 hours, 7 weeks of teamwork</span>
        <span>
          - Visual identity
          <br />- Web design
          <br />- Development
          <br />- Motion
          <br />- 3D
        </span>
        <span>
          I think it would be fair to say that the site is made in @rive_app. For the rest, @nextjs,
          @tailwindcss, and @docusaurus were used.
        </span>
        <span>
          Meet <span className="font-normal underline text-[#259df4]">gitness.com</span>
        </span>
      </>
    ),
    stats: {
      likes: '1,455',
      saves: '773',
      views: '173.8K',
      reposts: '150',
      comments: '87',
    },
  },
  {
    url: 'https://twitter.com/steventey/status/1705263264517796317?s=20',
    name: 'Steven Tey',
    nickname: 'steventey',
    followers: '36.5K',
    avatar: (
      <StaticImage
        src="./images/avatar-steventey.png"
        alt="Steven Tey's avatar"
        width={36}
        height={36}
      />
    ),
    text: (
      <>
        <span>
          Open-source GitHub alternative just dropped →{' '}
          <span className="font-normal underline text-[#259df4]">gitness.com</span>
        </span>
        <span>
          Landing page built with
          <br />
          @nextjs, @tailwindcss and @rive_app
        </span>
      </>
    ),
    stats: {
      likes: '1,048',
      saves: '408',
      views: '101.9K',
      reposts: '126',
      comments: '37',
    },
  },
  {
    url: 'https://twitter.com/d__raptis/status/1711319888416166027?s=20',
    name: 'Jim Raptis',
    nickname: 'd__raptis',
    followers: '18.8K',
    avatar: (
      <StaticImage
        src="./images/avatar-d-raptis.png"
        alt="Jim Raptis's avatar"
        width={36}
        height={36}
      />
    ),
    text: (
      <>
        <span>Love these hidden micro interactions</span>
        <StaticImage
          className="rounded-md overflow-hidden"
          src="./images/migrate-button.jpg"
          alt="Example of hidden micro interactions"
          width={320}
          height={108}
        />
      </>
    ),
    stats: {
      likes: '452',
      saves: '408',
      views: '169',
      reposts: '22',
      comments: '16',
    },
  },
  {
    url: 'https://twitter.com/midudev/status/1706028702528680040?s=20',
    name: 'Miguel Ángel Durán',
    nickname: 'midudev',
    followers: '218.4K',
    avatar: (
      <StaticImage
        src="./images/avatar-midudev.png"
        alt="Miguel Ángel Durán's avatar"
        width={36}
        height={36}
      />
    ),
    text: (
      <>
        <span>
          &quot;Ser Desarrollador Web es pintar dos botones&quot;
          <br />
          Los botones:
        </span>
        <StaticImage
          className="rounded-md overflow-hidden"
          src="./images/gitness-preview.jpg"
          alt="Website of gitness"
          width={320}
          height={196}
        />
      </>
    ),
    stats: {
      likes: '1,368',
      saves: '194',
      views: '85.8K',
      reposts: '116',
      comments: '29',
    },
  },
];

const Community = () => (
  <section className="relative max-h-[908px] overflow-hidden safe-paddings bg-gray-2 lg:max-h-none lg:pt-36 lg:pb-28 sm:pt-14">
    <div className="container flex justify-center lg:flex-col">
      <div className="relative z-10 max-w-[35%] mt-3 mr-auto pt-36 bg-gray-2 lg:max-w-[728px] lg:ml-auto lg:pt-0 sm:max-w-none sm:mt-1 sm:mx-auto">
        <h2 className="mt-1.5 mb-4 font-normal text-[64px] leading-[1.1] -tracking-[0.04em] lg:text-5xl sm:mb-3 sm:text-[32px]">
          <span className="block">Get noticed </span>
          by community
        </h2>
        <p className="mb-14 pb-1 font-light text-xl leading-snug text-gray-8 opacity-80 sm:mb-9 sm:text-lg">
          Expertly crafted design can drive additional traffic. In the first week, Gitness project
          gained:
        </p>
        <ul className="relative z-10 grid gap-8 lg:grid-cols-2 sm:grid-cols-1">
          {stats.map(({ amount, title }) => (
            <li key={title} className="grid gap-1">
              <span className="text-8xl leading-none -tracking-[0.04em] text-red lg:text-[88px]">
                {amount}
              </span>
              <span className="text-xl leading-none -tracking-[0.01em] opacity-80 sm:text-lg">
                {title}
              </span>
            </li>
          ))}
        </ul>
        <div
          className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-[120%] h-60 bg-[linear-gradient(180deg,#f5f5f5_75%,rgba(255,255,255,0)_100%)]"
          aria-hidden
        />
      </div>
      <div className="grid grid-cols-2 gap-6 lg:-mt-40 lg:-mb-64 sm:grid-cols-1 sm:gap-4 sm:-mt-[148px] sm:-mb-72">
        <div className="flex flex-col gap-6 -mt-[174px] lg:items-end lg:mt-0 sm:items-center sm:gap-4">
          <Card />
          {data
            .filter((_, index) => index % 2 === 0)
            .map((item) => (
              <Card key={item.nickname} content={item} />
            ))}
          <Card className="sm:hidden" />
        </div>
        <div className="flex flex-col gap-6 -mt-[109px] lg:mt-16 sm:items-center sm:mt-0">
          <Card className="sm:hidden" />
          {data
            .filter((_, index) => index % 2 !== 0)
            .map((item) => (
              <Card key={item.nickname} content={item} />
            ))}
          <Card />
        </div>
        <div
          className="absolute -top-8 left-1/2 -translate-x-[32%] w-[1388px] h-[980px] bg-[radial-gradient(circle,rgba(255,255,255,0)_0%,#f5f5f5_75%)] blur lg:-translate-x-1/2 lg:top-auto lg:bottom-0 lg:h-[1025px] sm:-bottom-48 sm:h-[1920px]"
          aria-hidden
        />
      </div>
    </div>
  </section>
);

export default Community;
