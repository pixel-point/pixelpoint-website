import algoliasearch from 'algoliasearch/lite';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Configure, Index, InstantSearch, Hits } from 'react-instantsearch-hooks-web';
import { LinkedinShareButton, TwitterShareButton } from 'react-share';

import Link from 'components/shared/link';
import LinkedinIcon from 'images/linkedin.inline.svg';
import TwitterIcon from 'images/twitter.inline.svg';
import algoliaQueries from 'utils/algolia-queries';
import getBlogPostPath from 'utils/get-blog-post-path';

const indices = [{ name: algoliaQueries[0].indexName, title: 'Blog', hitComp: 'postPageHit' }];

const Hit = ({ hit: { slug, cover, title } }) => (
  <Link
    className="flex items-center space-x-4 text-sm transition-colors duration-200 hover:text-red"
    to={getBlogPostPath(slug)}
  >
    <GatsbyImage
      className="w-20 shrink-0 rounded-sm"
      imgClassName="rounded-sm"
      image={getImage(cover)}
      loading="eager"
      alt=""
    />
    <h3 className="text-sm font-normal line-clamp-2">{title}</h3>
  </Link>
);

Hit.propTypes = {
  hit: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    cover: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

const Sidebar = ({ slug, category, tags, author, socialShareUrl }) => {
  const searchClient = useMemo(
    () => algoliasearch(process.env.GATSBY_ALGOLIA_APP_ID, process.env.GATSBY_ALGOLIA_SEARCH_KEY),
    []
  );

  const tagsFilter = tags?.map((tag) => `tags:"${tag}"`).join(' OR ');
  const filters = `category:${category} AND NOT slug:${slug}${
    tagsFilter ? ` AND (${tagsFilter})` : ''
  }`;

  return (
    <aside className="absolute -right-12 top-0 h-full max-w-[344px] translate-x-full xl:relative xl:right-0 xl:h-auto xl:translate-x-0 lg:max-w-[300px] md:mt-10 md:max-w-none">
      <div className="scrollbar-hidden sticky right-0 top-4 max-h-screen overflow-auto rounded-2xl border border-gray-4 p-8 dark:border-gray-8 md:relative md:top-0 md:max-h-full md:border-none md:p-0 dark:md:bg-transparent">
        <GatsbyImage
          className="w-16 shrink-0 rounded-full"
          imgClassName="rounded-full"
          image={getImage(author.photo)}
          alt={author.name}
          loading="eager"
        />
        <h2 className="mt-3.5 text-lg font-semibold">{author.name}</h2>
        <p className="mt-2.5">{author.description}</p>
        {author.twitterUrl && (
          <Link
            className="mt-5 inline-flex items-center space-x-3 rounded-full bg-[#259df4] py-2.5 pl-3.5 pr-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#1781cf]"
            to={author.twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon className="h-5" /> <span>Follow on Twitter</span>
          </Link>
        )}
        <h2 className="mt-8 border-t border-t-gray-4 pt-8 text-lg font-semibold dark:border-t-gray-8">
          More from Pixel Point
        </h2>
        <InstantSearch searchClient={searchClient} indexName={indices[0].name}>
          {indices.map(({ name }) => (
            <Index indexName={name} key={name}>
              <Configure filters={filters} />
              <Hits
                hitComponent={Hit}
                transformItems={(items) => items.slice(0, 4)}
                classNames={{ list: 'mt-5 space-y-6', item: 'sidebar-posts-item' }}
              />
            </Index>
          ))}
        </InstantSearch>

        <h2 className="mt-8 border-t border-t-gray-4 pt-8 text-sm font-normal dark:border-t-gray-8">
          Share this article:
        </h2>
        <ul className="mt-3.5 flex space-x-4">
          <li>
            <TwitterShareButton
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-2 text-gray-8 transition-colors duration-200 hover:!bg-[#259df4] hover:text-white dark:bg-white dark:shadow-none md:bg-[#259df4] md:text-white dark:md:bg-[#259df4]"
              url={socialShareUrl}
              resetButtonStyle={false}
            >
              <TwitterIcon className="h-5" />
            </TwitterShareButton>
          </li>
          <li>
            <LinkedinShareButton
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-2 text-gray-8 transition-colors duration-200 hover:!bg-[#3380cc] hover:text-white dark:bg-white dark:shadow-none md:bg-[#3380cc] md:text-white dark:md:bg-[#3380cc]"
              url={socialShareUrl}
              resetButtonStyle={false}
            >
              <LinkedinIcon className="h-4.5" />
            </LinkedinShareButton>
          </li>
        </ul>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  slug: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  author: PropTypes.exact({
    name: PropTypes.string.isRequired,
    photo: PropTypes.exact({
      childImageSharp: PropTypes.exact({
        gatsbyImageData: PropTypes.object.isRequired,
      }).isRequired,
    }).isRequired,
    description: PropTypes.string.isRequired,
    twitterUrl: PropTypes.string,
  }).isRequired,
  socialShareUrl: PropTypes.string.isRequired,
};

Sidebar.defaultProps = {
  tags: [],
};

export default Sidebar;
