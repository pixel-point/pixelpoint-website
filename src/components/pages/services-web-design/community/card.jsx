import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import check from './images/check.svg';
import comment from './images/comment.svg';
import like from './images/like.svg';
import repost from './images/repost.svg';
import save from './images/save.svg';
import view from './images/view.svg';

const classes =
  'w-full max-w-[352px] p-3.5 pt-4 pl-4 bg-white rounded-2xl border border-gray-3 shadow-[0_2px_4px_rgba(0,0,0,0.06)] xs:px-2';

const Card = ({ content, className }) => {
  if (!content) {
    return <div className={clsx(classes, className, 'h-[259px]')} aria-hidden />;
  }

  const {
    url,
    name,
    nickname,
    followers,
    avatar,
    text,
    stats: { likes, saves, views, reposts, comments },
  } = content;

  return (
    <a
      className={clsx(
        classes,
        'relative z-10 hover:shadow-[0_2px_25px_0_rgba(0,0,0,0.15),0_2px_4px_0_rgba(0,0,0,0.06)]'
      )}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <article>
        <header className="grid grid-cols-[36px_1fr] gap-x-2 mb-4 font-normal text-sm leading-tight xs:grid-cols-[24px_1fr] xs:text-xs">
          <div className="row-span-2">{avatar}</div>
          <span className="col-start-2 flex items-end gap-0.5 whitespace-nowrap">
            {name}
            <img src={check} width="16" height="16" alt="" loading="lazy" />
            {followers && (
              <span className="text-xs leading-none text-red self-center">
                {followers} Followers
              </span>
            )}
          </span>
          <span className="col-start-2 font-normal underline text-[#259df4]">@{nickname}</span>
        </header>
        <div className="grid gap-3 mb-4 font-light text-sm leading-tight">{text}</div>
        <ul className="flex gap-5 pt-4 text-xs leading-none text-gray-8 border-t border-black/10 xs:gap-2">
          <li className="flex items-center gap-1 font-semibold text-red">
            <img src={like} width="16" height="16" alt="" loading="lazy" />
            {likes}
          </li>
          <li className="flex items-center gap-1 font-semibold text-[#259df4]">
            <img src={save} width="16" height="16" alt="" loading="lazy" />
            {saves}
          </li>
          <li className="flex items-center gap-1 font-normal">
            <img src={view} width="16" height="16" alt="" loading="lazy" />
            {views}
          </li>
          <li className="flex items-center gap-1 font-normal">
            <img src={repost} width="16" height="16" alt="" loading="lazy" />
            {reposts}
          </li>
          <li className="flex items-center gap-1 font-normal">
            <img src={comment} width="16" height="16" alt="" loading="lazy" />
            {comments}
          </li>
        </ul>
      </article>
    </a>
  );
};

Card.propTypes = {
  content: PropTypes.exact({
    url: PropTypes.string,
    name: PropTypes.string,
    nickname: PropTypes.string,
    followers: PropTypes.string,
    avatar: PropTypes.node,
    text: PropTypes.node,
    stats: PropTypes.exact({
      likes: PropTypes.string,
      saves: PropTypes.string,
      views: PropTypes.string,
      reposts: PropTypes.string,
      comments: PropTypes.string,
    }),
  }),
  className: PropTypes.string,
};

Card.defaultProps = {
  content: null,
  className: '',
};

export default Card;
