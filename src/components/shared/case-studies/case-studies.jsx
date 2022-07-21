import { useStaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import Link from 'components/shared/link';
import { CASE_STUDIES_BASE_PATH } from 'constants/case-studies';
import LINKS from 'constants/links';
import GithubLogo from 'images/github.inline.svg';

import Animation from './animation';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));
}

const Card = ({ logo, title, description, slug, githubStars }) => {
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const [rive, setRive] = useState(null);

  const handleMouseEnter = () => {
    if (rive && !rive.isPlaying) rive.play([`hover-${getRandomInt(1, 5)}`]);
  };

  return (
    <Link
      className="with-nested-link-red-hover block"
      to={`${CASE_STUDIES_BASE_PATH}${slug}`}
      onMouseEnter={handleMouseEnter}
    >
      <h3 className="sr-only">{`${title} case study`}</h3>
      <div
        className="relative flex min-h-[200px] items-center justify-center overflow-hidden rounded-2xl bg-black lg:min-h-[154px] lg:rounded-xl md:min-h-[180px] sm:min-h-[170px]"
        ref={wrapperRef}
      >
        <img
          className="relative z-10 lg:scale-[0.85] md:scale-100 sm:scale-[0.9]"
          src={logo.url.publicURL}
          loading="lazy"
          alt={`${title} logo`}
          height={logo.height}
          width={logo.width}
        />
        {githubStars && (
          <div className="absolute top-3 left-3 z-10 flex items-center lg:top-2.5 lg:left-2.5 md:top-3 md:left-3">
            <GithubLogo className="h-[26px] text-white" />
            <p
              className="ml-2 text-xs font-semibold text-white"
              aria-label={`${githubStars} stars on Github`}
            >
              {githubStars}
            </p>
          </div>
        )}
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <Animation
            src="/animations/shared/case-studies-card.riv"
            isWrapperInView={isWrapperInView}
            setRive={setRive}
            width={384}
            height={200}
          />
        </div>
      </div>
      <p className="mt-2.5 text-lg font-normal leading-snug">{description}</p>
      <Link className="nested-link-red mt-2.5" size="base" theme="arrow-red" withoutHover>
        {title} case study
      </Link>
    </Link>
  );
};

Card.propTypes = {
  logo: PropTypes.exact({
    url: PropTypes.exact({
      publicURL: PropTypes.string.isRequired,
    }),
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  githubStars: PropTypes.string,
};

Card.defaultProps = {
  githubStars: null,
};

const CaseStudies = ({ title, itemsType, activeItemSlug, withoutTitleLink }) => {
  const {
    allMdx: { nodes },
  } = useStaticQuery(graphql`
    query {
      allMdx(
        filter: { fileAbsolutePath: { regex: "/case-studies/" } }
        sort: { fields: frontmatter___position, order: ASC }
      ) {
        nodes {
          slug
          fields {
            isDraft
          }
          frontmatter {
            logo {
              url {
                publicURL
              }
              width
              height
            }
            title
            description
            githubUsername
            githubRepoName
            isOpenSource
            isFeatured
          }
          githubStars
        }
      }
    }
  `);

  const items = nodes
    .filter(({ fields: { isDraft } }) => {
      if (process.env.NODE_ENV === 'production') return !isDraft;
      return true;
    })
    .filter(({ frontmatter: { isOpenSource, isFeatured }, slug }) => {
      if (slug === activeItemSlug) return false;
      if (itemsType === 'open-source') return isOpenSource;
      if (itemsType === 'not-featured') return !isFeatured;
      return false;
    });

  const itemsToRender = itemsType === 'open-source' ? items.slice(0, 6) : items;

  return (
    <section className="safe-paddings mt-52 lg:mt-36 md:mt-28 sm:mt-20">
      <div className="container">
        <h2 className="max-w-[950px] text-4xl font-normal leading-snug lg:text-[32px] sm:text-2xl">
          <span className="with-text-highlight-red" dangerouslySetInnerHTML={{ __html: title }} />{' '}
          {!withoutTitleLink && (
            <Link to={LINKS.caseStudies} size="4xl" theme="arrow-red">
              See all cases
            </Link>
          )}
        </h2>
        <ul className="grid-gap-x mt-16 grid grid-cols-3 gap-y-16 lg:mt-14 lg:gap-y-14 md:mt-11 md:grid-cols-2 md:gap-y-11 sm:mt-10 sm:block sm:space-y-10">
          {itemsToRender.map(({ slug, frontmatter, githubStars }, index) => (
            <li key={index}>
              <Card {...frontmatter} slug={slug} githubStars={githubStars} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

CaseStudies.propTypes = {
  title: PropTypes.node.isRequired,
  itemsType: PropTypes.oneOf(['open-source', 'not-featured']),
  activeItemSlug: PropTypes.string,
  withoutTitleLink: PropTypes.bool,
};

CaseStudies.defaultProps = {
  itemsType: 'open-source',
  activeItemSlug: '',
  withoutTitleLink: false,
};

export default CaseStudies;
