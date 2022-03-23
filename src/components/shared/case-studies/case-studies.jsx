import { useStaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import Link from 'components/shared/link';
import { CASE_STUDIES_BASE_PATH } from 'constants/case-studies';
import GithubLogo from 'images/github.inline.svg';

const Card = ({ logo, title, description, githubStars, slug }) => {
  const { RiveComponent, rive } = useRive({
    src: '/animations/shared/case-studies-card.riv',
    autoplay: false,
    layout: new Layout({
      fit: Fit.FitHeight,
      alignment: Alignment.Center,
    }),
  });

  const handleMouseEnter = () => {
    if (rive && !rive.isPlaying) rive.play(['Animations']);
  };

  return (
    <Link
      className="with-nested-link-red-hover block"
      to={`${CASE_STUDIES_BASE_PATH}/${slug}`}
      onMouseEnter={handleMouseEnter}
    >
      <h1 className="sr-only">{`${title} case study`}</h1>
      <div className="relative flex min-h-[200px] items-center justify-center overflow-hidden rounded-2xl bg-black lg:min-h-[154px] lg:rounded-xl md:min-h-[180px] sm:min-h-[170px]">
        <img
          className="relative z-10 lg:scale-[0.85] md:scale-100 sm:scale-[0.9]"
          src={logo.publicURL}
          loading="lazy"
          alt={`${title} logo`}
        />
        <div className="absolute top-3 left-3 z-10 flex items-center lg:top-2.5 lg:left-2.5 md:top-3 md:left-3">
          <GithubLogo className="h-[26px] text-white" />
          <p
            className="ml-2 text-xs font-semibold text-white"
            aria-label={`${githubStars} stars on Github`}
          >
            {githubStars}
          </p>
        </div>
        <RiveComponent className="absolute top-0 left-0 right-0 bottom-0" />
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
    publicURL: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  githubStars: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

// const CaseStudies = ({ title, itemsType, withoutTitleLink }) => {
const CaseStudies = ({ title, itemsType, activeItemSlug }) => {
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
              publicURL
            }
            title
            description
            githubStars
            isOpenSource
            isFeatured
          }
        }
      }
    }
  `);

  const items = nodes
    .filter(({ fields: { isDraft } }) => {
      if (
        process.env.NODE_ENV === 'production' &&
        process.env.CONTEXT !== 'deploy-preview' &&
        process.env.CONTEXT !== 'branch-deploy'
      ) {
        return !isDraft;
      }
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
        <h2 className="max-w-[800px] text-4xl font-normal leading-snug lg:text-[32px] sm:text-2xl">
          {title}{' '}
          {/* {!withoutTitleLink && (
            <Link to="/case-studies" size="4xl" theme="arrow-red">
              See all cases
            </Link>
          )} */}
        </h2>
        <ul className="grid-gap-x mt-16 grid grid-cols-3 gap-y-16 lg:mt-14 lg:gap-y-14 md:mt-11 md:grid-cols-2 md:gap-y-11 sm:mt-10 sm:block sm:space-y-10">
          {itemsToRender.map(({ slug, frontmatter }, index) => (
            <li key={index}>
              <Card {...frontmatter} slug={slug} />
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
  // withoutTitleLink: PropTypes.bool,
};

CaseStudies.defaultProps = {
  itemsType: 'open-source',
  activeItemSlug: '',
  // withoutTitleLink: false,
};

export default CaseStudies;
