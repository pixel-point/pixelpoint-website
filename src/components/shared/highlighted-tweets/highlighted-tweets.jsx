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

const HighlightedTweets = ({ withTopMargin }) => {
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
      className={clsx(
        'safe-paddings bg-gray-2 py-28 lg:py-24 md:py-20 sm:py-16',
        withTopMargin && 'mt-52 lg:mt-36 md:mt-28 sm:mt-20'
      )}
    >
      <div className="container flex items-center justify-between sm:block">
        <h2 className="text-4xl md:text-[32px] sm:text-2xl">Highlighted tweets</h2>
        <div className="flex items-center space-x-4 sm:mt-9">
          <StaticImage
            className="w-12 rounded-full"
            imgClassName="rounded-full"
            src="../../../images/alex-barashkov.jpg"
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
      <ul className="scrollbar-hidden mt-10 flex snap-x items-start space-x-8 overflow-auto px-[calc((100vw-1216px)/2)] lg:px-10 md:space-x-5 md:px-7 sm:mt-7 sm:px-4">
        {sortedItems.map(
          (
            {
              full_text,
              display_text_range,
              retweet_count,
              favorite_count,
              entities: { media, user_mentions, urls },
            },
            index
          ) => {
            const displayText = getCorrectDisplayText(full_text, display_text_range);

            const textWithFormatting = handleTextFormatting(displayText, {
              userMentions: user_mentions,
              urls,
            });

            return (
              <li
                className="with-link-twitter max-w-[384px] shrink-0 snap-center overflow-hidden rounded-xl border border-gray-4 bg-white sm:max-w-[328px]"
                style={{ boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.08)' }}
                key={index}
              >
                <p
                  className="whitespace-pre-line p-5 md:p-4"
                  dangerouslySetInnerHTML={{ __html: textWithFormatting }}
                />
                {media && media.length > 0 && media[0].type === 'photo' && (
                  <img src={media[0].media_url_https} alt="" />
                )}
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
              </li>
            );
          }
        )}
      </ul>
    </section>
  );
};

HighlightedTweets.propTypes = {
  withTopMargin: PropTypes.bool,
};

HighlightedTweets.defaultProps = {
  withTopMargin: false,
};

export default HighlightedTweets;
