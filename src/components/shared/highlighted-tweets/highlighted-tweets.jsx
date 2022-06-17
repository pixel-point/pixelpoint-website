/* eslint-disable camelcase */
import clsx from 'clsx';
import { graphql, useStaticQuery } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import ImagePlaceholder from 'components/shared/image-placeholder';
import Link from 'components/shared/link';
import highlightedTweets from 'constants/highlighted-tweets';
import LINKS from 'constants/links';
import TwitterIcon from 'images/twitter.inline.svg';

import ChatIcon from './images/chat.inline.svg';
import HeartIcon from './images/heart.inline.svg';
import RetweetIcon from './images/retweet.inline.svg';

function handleMentions(text, mentions) {
  let textWithMentions = text;

  mentions.forEach(({ username }) => {
    textWithMentions = textWithMentions.replace(
      `@${username}`,
      `<a href="https://twitter.com/${username}" target="_blank" rel="noopener noreferrer">@${username}</a>`
    );
  });

  return textWithMentions;
}

function handleUrls(text, urls) {
  let textWithUrls = text;

  urls.forEach(({ display_url, url }) => {
    textWithUrls = textWithUrls.replace(
      url,
      `<a href="${url}" target="_blank" rel="noopener">${display_url}</a>`
    );
  });

  return textWithUrls;
}

function handleTextFormatting(text, { mentions, urls }) {
  let formattedText = text;

  if (mentions && mentions.length > 0) {
    formattedText = handleMentions(formattedText, mentions);
  }

  if (urls && urls.length > 0) {
    formattedText = handleUrls(formattedText, urls);
  }

  return formattedText;
}

const HighlightedTweets = ({ className }) => {
  const {
    allHighlightedTweet: { nodes: items },
  } = useStaticQuery(graphql`
    query {
      allHighlightedTweet {
        nodes {
          tweet_id
          text
          entities {
            mentions {
              start
              end
              username
            }
            urls {
              start
              end
              display_url
              url
            }
          }
          media {
            height
            width
            type
            url
            preview_image_url
            variants {
              content_type
              bit_rate
              url
            }
          }
          public_metrics {
            like_count
            reply_count
            retweet_count
          }
        }
      }
    }
  `);

  // We have to sort on our own because sort in a graphql query is not working for some reason =/
  const sortedItems = Object.keys(highlightedTweets).map((tweetId) =>
    items.find(({ tweet_id }) => tweet_id === tweetId)
  );

  return (
    <section
      className={clsx(
        'safe-paddings bg-gray-2 pt-28 dark:bg-black lg:pt-24 md:pt-20 sm:pt-16',
        className
      )}
    >
      <div className="container flex items-center justify-between sm:block">
        <h2 className="text-4xl md:text-[32px] sm:text-2xl">Highlighted tweets</h2>
        <div className="flex items-center space-x-4 sm:mt-9">
          <StaticImage
            className="w-12 rounded-full"
            imgClassName="rounded-full"
            layout="fixed"
            width={48}
            height={48}
            src="../../../images/post-authors/alex-barashkov.jpg"
            alt="Alex Barashkov"
          />
          <span className="font-normal">
            Alex Barashkov <span className="md:hidden">— CEO at Pixel Point</span>
          </span>
          <Link
            className="inline-flex items-center space-x-3 rounded-full bg-[#259df4] py-2.5 pl-3.5 pr-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#1781cf]"
            to={LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon className="h-5" /> <span>Follow</span>
          </Link>
        </div>
      </div>
      <ul className="scrollbar-hidden flex snap-x items-start space-x-8 overflow-auto px-[calc((100vw-1216px)/2)] pt-10 pb-28 lg:space-x-7 lg:px-10 lg:pb-24 md:space-x-5 md:px-7 md:pb-20 sm:px-4 sm:pt-7 sm:pb-16">
        {sortedItems.map(
          (
            {
              tweet_id,
              text,
              entities: { mentions, urls },
              media,
              public_metrics: { like_count, reply_count, retweet_count },
            },
            index
          ) => {
            const textWithFormatting = handleTextFormatting(
              text.slice(
                highlightedTweets[tweet_id].display_text_range[0],
                highlightedTweets[tweet_id].display_text_range[1]
              ),
              { mentions, urls }
            );

            let mediaType;
            let mediaUrl;

            if (media && media.length > 0 && media[0].type === 'video') {
              mediaType = 'video';
              const videoWithHighestBitrate = media[0].variants
                .filter(({ content_type }) => content_type === 'video/mp4')
                .sort((a, b) => b.bit_rate - a.bit_rate)[0];
              mediaUrl = videoWithHighestBitrate.url;
            } else if (media && media.length > 0 && media[0].type === 'photo') {
              mediaType = 'photo';
              mediaUrl = media[0].url;
            }

            return (
              <li
                className="relative max-w-[384px] shrink-0 snap-center overflow-hidden rounded-xl border border-gray-4 bg-white dark:border-gray-8 dark:bg-gray-9 md:max-w-[346px] sm:max-w-[328px]"
                style={{ boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.08)' }}
                key={index}
              >
                <Link
                  className="with-link-twitter block"
                  to={`https://twitter.com/alex_barashkov/status/${tweet_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p
                    className="whitespace-pre-line p-5 md:p-4"
                    dangerouslySetInnerHTML={{ __html: textWithFormatting }}
                  />
                  {mediaType === 'video' && mediaUrl && (
                    <ImagePlaceholder height={media[0].height} width={media[0].width} />
                  )}
                  {mediaType === 'photo' && mediaUrl && (
                    <img src={mediaUrl} loading="lazy" alt="" aria-hidden />
                  )}
                  {highlightedTweets[tweet_id].link_preview_url && (
                    <img
                      src={highlightedTweets[tweet_id].link_preview_url}
                      loading="lazy"
                      alt=""
                      aria-hidden
                    />
                  )}
                  <ul className="flex items-center justify-between p-5 text-xs font-normal md:p-4">
                    <li className="flex items-center space-x-1.5">
                      <ChatIcon className="h-4.5" /> <span>{reply_count}</span>
                    </li>
                    <li className="flex items-center space-x-1.5">
                      <RetweetIcon className="h-4.5" /> <span>{retweet_count}</span>
                    </li>
                    <li className="flex items-center space-x-1.5">
                      <HeartIcon className="h-4.5" /> <span className="text-red">{like_count}</span>
                    </li>
                  </ul>
                </Link>
                {mediaType === 'video' && mediaUrl && (
                  <video
                    className="absolute bottom-[58px] left-0 right-0 w-full md:bottom-[50px]"
                    preload="none"
                    poster={media[0].preview_image_url}
                    controls
                    muted
                  >
                    <source src={mediaUrl} type="video/mp4" />
                  </video>
                )}
              </li>
            );
          }
        )}
      </ul>
    </section>
  );
};

HighlightedTweets.propTypes = {
  className: PropTypes.string,
};

HighlightedTweets.defaultProps = {
  className: null,
};

export default HighlightedTweets;
