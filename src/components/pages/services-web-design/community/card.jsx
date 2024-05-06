import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import check from './images/check.svg';
import comment from './images/comment.svg';
import like from './images/like.svg';
import repost from './images/repost.svg';
import save from './images/save.svg';
import view from './images/view.svg';

const Card = ({ content, className }) => {
  const classes =
    'w-[352px] p-3.5 pt-4 pl-4 bg-white rounded-2xl border border-gray-3 sm:w-[328px]';
  const styles = { boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.06)' };

  if (!content) {
    return <div className={clsx(classes, className, 'h-[259px]')} style={styles} aria-hidden />;
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
    <a className="relative" href={url} target="_blank" rel="noopener noreferrer">
      <article className={classes} style={styles} aria-hidden>
        <header className="grid grid-cols-[36px_1fr] gap-x-2 mb-4 font-normal text-sm leading-tight">
          <div className="row-span-2">{avatar}</div>
          <span className="col-start-2 flex items-end gap-0.5 whitespace-nowrap">
            {name}
            <img src={check} width="16" height="16" alt="" loading="lazy" aria-hidden />
            {followers && (
              <span className="text-xs leading-none text-red">{followers} Followers</span>
            )}
          </span>
          <span className="col-start-2 font-normal underline text-[#259df4]">@{nickname}</span>
        </header>
        <p className="grid gap-3 mb-4 font-light text-sm leading-tight">{text}</p>
        <ul className="flex gap-5 pt-4 text-xs leading-none text-gray-8 border-t border-black/10 sm:gap-4">
          <li className="flex items-center gap-1 font-semibold text-red">
            <img src={like} width="16" height="16" alt="" loading="lazy" aria-hidden />
            {likes}
          </li>
          <li className="flex items-center gap-1 font-semibold text-[#259df4]">
            <img src={save} width="16" height="16" alt="" loading="lazy" aria-hidden />
            {saves}
          </li>
          <li className="flex items-center gap-1 font-normal">
            <img src={view} width="16" height="16" alt="" loading="lazy" aria-hidden />
            {views}
          </li>
          <li className="flex items-center gap-1 font-normal">
            <img src={repost} width="16" height="16" alt="" loading="lazy" aria-hidden />
            {reposts}
          </li>
          <li className="flex items-center gap-1 font-normal">
            <img src={comment} width="16" height="16" alt="" loading="lazy" aria-hidden />
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
