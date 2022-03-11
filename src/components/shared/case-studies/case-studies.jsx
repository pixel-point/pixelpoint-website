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
      className="with-nested-link-red-hover flex flex-col"
      to={`${CASE_STUDIES_BASE_PATH}/${slug}`}
      onMouseEnter={handleMouseEnter}
    >
      <h1 className="sr-only">{`${title} case study`}</h1>
      <div className="relative flex aspect-[384/200] items-center justify-center overflow-hidden rounded-2xl bg-black">
        <img
          className="relative z-10 lg:scale-[0.8] md:scale-100 xs:scale-[0.8]"
          src={logo.publicURL}
          loading="lazy"
          alt={`${title} logo`}
        />
        <div className="absolute top-3 left-3 z-10 flex items-center">
          <GithubLogo className="h-7 text-white" />
          <p
            className="ml-2 text-xs font-semibold text-white"
            aria-label={`${githubStars} stars on Github`}
          >
            {githubStars}
          </p>
        </div>
        <RiveComponent className="absolute top-0 left-0 right-0 bottom-0" />
      </div>
      <p className="my-4 font-normal leading-snug md:my-3">{description}</p>
      <Link
        className="nested-link-red mt-auto self-start"
        size="base"
        theme="arrow-red"
        withoutHover
      >
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

const CaseStudies = ({ title, itemsType }) => {
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
      )
        return !isDraft;
      return true;
    })
    .filter(({ frontmatter: { isOpenSource, isFeatured } }) => {
      if (itemsType === 'open-source') return isOpenSource;
      if (itemsType === 'not-featured') return !isFeatured;
      return false;
    });

  const itemsToRender = itemsType === 'open-source' ? items.slice(0, 5) : items;

  return (
    <section className="safe-paddings mt-52 lg:mt-44 md:mt-36 sm:mt-20">
      <div className="container">
        <h2 className="max-w-[800px] text-4xl font-normal leading-snug lg:max-w-[650px] lg:text-3xl md:max-w-[500px] md:text-2xl sm:max-w-[420px] sm:text-xl">
          {title}
        </h2>
        <div className="grid-gap-x mt-16 grid grid-cols-3 gap-y-16 lg:mt-12 lg:gap-y-12 md:mt-10 md:grid-cols-2 md:gap-y-10 sm:mt-8 sm:block sm:space-y-8">
          {itemsToRender.map(({ slug, frontmatter }, index) => (
            <Card {...frontmatter} slug={slug} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

CaseStudies.propTypes = {
  title: PropTypes.node,
  itemsType: PropTypes.oneOf(['open-source', 'not-featured']),
};

CaseStudies.defaultProps = {
  title: (
    <>
      We provide design & development services for popular{' '}
      <span className="text-red">Open-Source</span> projects:
    </>
  ),
  itemsType: 'open-source',
};

export default CaseStudies;
