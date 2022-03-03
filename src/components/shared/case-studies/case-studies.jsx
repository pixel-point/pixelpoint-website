import { useStaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import { CASE_STUDIES_BASE_PATH } from 'constants/case-studies';
import GithubLogo from 'images/github.inline.svg';

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
      if (process.env.NODE_ENV === 'production') return !isDraft;
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
          {itemsToRender.map(
            ({ slug, frontmatter: { logo, title, description, githubStars } }, index) => (
              <article className="flex flex-col" key={index}>
                <h1 className="sr-only">{`${title} case study`}</h1>
                <Link
                  className="relative flex aspect-[384/200] items-center justify-center rounded-2xl"
                  to={`${CASE_STUDIES_BASE_PATH}/${slug}`}
                  aria-label={`${title} case study`}
                  style={{ background: 'linear-gradient(254.82deg, #333333 0%, #000000 100%)' }}
                >
                  <img
                    className="lg:scale-[0.8] md:scale-100 xs:scale-[0.8]"
                    src={logo.publicURL}
                    loading="lazy"
                    alt={`${title} logo`}
                  />
                  <div className="absolute top-3 left-3 flex items-center">
                    <GithubLogo className="h-7 text-white" />
                    <p
                      className="ml-2 text-xs font-semibold text-white"
                      aria-label={`${githubStars} stars on Github`}
                    >
                      {githubStars}
                    </p>
                  </div>
                </Link>
                <p className="my-4 font-normal leading-snug md:my-3">{description}</p>
                <Link
                  className="mt-auto self-start"
                  to={`${CASE_STUDIES_BASE_PATH}/${slug}`}
                  size="base"
                  theme="arrow-red"
                >
                  {title} case study
                </Link>
              </article>
            )
          )}
          {/* {itemsType === 'open-source' && (
            <Link
              className="relative flex aspect-[384/200] items-center justify-center rounded-2xl"
              to={CASE_STUDIES_BASE_PATH}
              style={{ background: 'linear-gradient(247.55deg, #fcfcfc 0%, #f7f7f7 100%)' }}
            >
              <Link size="2xl" theme="arrow-red">
                All case studies
              </Link>
            </Link>
          )} */}
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
