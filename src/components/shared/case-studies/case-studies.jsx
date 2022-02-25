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

  return (
    <section className="safe-paddings mt-52">
      <div className="container">
        <h2 className="max-w-[800px] text-4xl font-normal leading-snug">{title}</h2>
        <div className="grid-gap-x mt-16 grid grid-cols-3 gap-y-16">
          {items.map(({ slug, frontmatter: { logo, title, description, githubStars } }, index) => (
            <article className="flex flex-col" key={index}>
              <h1 className="sr-only">{`${title} case study`}</h1>
              <Link
                className="relative flex aspect-[384/200] items-center justify-center rounded-2xl"
                to={`${CASE_STUDIES_BASE_PATH}/${slug}`}
                aria-label={`${title} case study`}
                style={{ background: 'linear-gradient(254.82deg, #333333 0%, #000000 100%)' }}
              >
                <img src={logo.publicURL} loading="lazy" alt={`${title} logo`} />
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
              <p className="my-4 font-normal leading-snug">{description}</p>
              <Link
                className="mt-auto self-start"
                to={`${CASE_STUDIES_BASE_PATH}/${slug}`}
                size="sm"
                theme="arrow-red"
              >
                {title} case study
              </Link>
            </article>
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
