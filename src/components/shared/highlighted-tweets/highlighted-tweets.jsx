/* eslint-disable camelcase */
import clsx from 'clsx';
import emojiRegex from 'emoji-regex';
import { graphql, useStaticQuery } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import highlightedTweets from 'constants/highlighted-tweets';
import LINKS from 'constants/links';
import TwitterIcon from 'images/twitter.inline.svg';

import ChatIcon from './images/chat.inline.svg';
import HeartIcon from './images/heart.inline.svg';
import RetweetIcon from './images/retweet.inline.svg';

function getCorrectIndice(text, indice) {
  const slice = text.slice(0, indice);
  const emoji = slice.match(emojiRegex());
  const emojiCount = emoji?.length;
  const emojiStringLength = emoji?.join('')?.length;
  const emojiExtraLength = emojiStringLength - emojiCount;

  return emojiExtraLength ? indice + emojiExtraLength : indice;
}

function getCorrectDisplayText(text, display_text_range) {
  return text.slice(
    getCorrectIndice(text, display_text_range[0]),
    getCorrectIndice(text, display_text_range[1])
  );
}

function handleUserMentions(text, userMentions) {
  let textWithUserMentions = text;

  userMentions.forEach(({ screen_name }) => {
    textWithUserMentions = textWithUserMentions.replace(
      `@${screen_name}`,
      `<a href="https://twitter.com/${screen_name}" target="_blank" rel="noopener noreferrer">@${screen_name}</a>`
    );
  });

  return textWithUserMentions;
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

function handleTextFormatting(text, { userMentions, urls }) {
  let formattedText = text;

  if (userMentions && userMentions.length > 0) {
    formattedText = handleUserMentions(formattedText, userMentions);
  }

  if (urls && urls.length > 0) {
    formattedText = handleUrls(formattedText, urls);
  }

  return formattedText;
}

const HighlightedTweets = ({ className }) => {
  const {
    allTwitterStatusesLookupAlexBarashkov: { nodes: items },
  } = useStaticQuery(graphql`
    query {
      allTwitterStatusesLookupAlexBarashkov {
        nodes {
          id_str
          full_text
          display_text_range
          retweet_count
          favorite_count
          entities {
            media {
              type
              media_url_https
            }
            user_mentions {
              screen_name
            }
            urls {
              display_url
              url
            }
          }
          extended_entities {
            media {
              type
              video_info {
                variants {
                  bitrate
                  content_type
                  url
                }
              }
            }
          }
        }
      }
    }
  `);

  // We have to sort on our own because sort in a graphql query is not working for some reason =/
  const sortedItems = highlightedTweets.map((tweetId) =>
    items.find(({ id_str }) => id_str === tweetId)
  );

  return (
    <section
      className={clsx('safe-paddings bg-gray-2 pt-28 lg:pt-24 md:pt-20 sm:pt-16', className)}
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
              id_str,
              full_text,
              display_text_range,
              retweet_count,
              favorite_count,
              entities: { media, user_mentions, urls },
              extended_entities,
            },
            index
          ) => {
            const displayText = getCorrectDisplayText(full_text, display_text_range);

            const textWithFormatting = handleTextFormatting(displayText, {
              userMentions: user_mentions,
              urls,
            });

            let mediaType;
            let mediaUrl;

            if (
              extended_entities &&
              extended_entities.media &&
              extended_entities.media.length > 0 &&
              extended_entities.media[0].type === 'video'
            ) {
              mediaType = 'video';
              const videoWithHighestBitrate = extended_entities.media[0].video_info.variants
                .filter(({ content_type }) => content_type === 'video/mp4')
                .sort((a, b) => b.bitrate - a.bitrate)[0];
              mediaUrl = videoWithHighestBitrate.url;
            } else if (media && media.length > 0 && media[0].type === 'photo') {
              mediaType = 'photo';
              mediaUrl = media[0].media_url_https;
            }

            return (
              <li
                className="max-w-[384px] shrink-0 snap-center overflow-hidden rounded-xl border border-gray-4 bg-white md:max-w-[346px] sm:max-w-[328px]"
                style={{ boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.08)' }}
                key={index}
              >
                <Link
                  className="with-link-twitter block"
                  to={`https://twitter.com/alex_barashkov/status/${id_str}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p
                    className="whitespace-pre-line p-5 md:p-4"
                    dangerouslySetInnerHTML={{ __html: textWithFormatting }}
                  />
                  {mediaType === 'video' && mediaUrl && (
                    <video className="w-full" poster={media[0].media_url_https} controls muted>
                      <source src={mediaUrl} type="video/mp4" />
                    </video>
                  )}
                  {mediaType === 'photo' && mediaUrl && <img src={mediaUrl} alt="" />}
                  <ul className="flex items-center justify-between p-5 text-xs font-normal md:p-4">
                    <li className="flex items-center space-x-1.5">
                      <ChatIcon className="h-4.5" /> <span>0</span>
                    </li>
                    <li className="flex items-center space-x-1.5">
                      <RetweetIcon className="h-4.5" /> <span>{retweet_count}</span>
                    </li>
                    <li className="flex items-center space-x-1.5">
                      <HeartIcon className="h-4.5" />{' '}
                      <span className="text-red">{favorite_count}</span>
                    </li>
                  </ul>
                </Link>
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
