import { useStaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ title, description, ogImage }) => {
  const {
    site: {
      siteMetadata: { siteTitle, siteDescription, siteUrl, siteImage, siteLanguage },
    },
  } = useStaticQuery(graphql`
    query SEO {
      site {
        siteMetadata {
          siteTitle
          siteDescription
          siteUrl
          siteImage
          siteLanguage
        }
      }
    }
  `);

  return (
    <Helmet
      title={title || siteTitle}
      htmlAttributes={{
        lang: siteLanguage,
        prefix: 'og: http://ogp.me/ns#',
      }}
    >
      {/* General */}
      <meta name="description" content={description || siteDescription} />
      {/* Open Graph */}
      <meta property="og:title" content={title || siteTitle} />
      <meta property="og:description" content={description || siteDescription} />
      <meta property="og:image" content={siteUrl + (ogImage || siteImage)} />
      <meta property="og:type" content="website" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  ogImage: PropTypes.string,
};

SEO.defaultProps = {
  title: null,
  description: null,
  ogImage: null,
};

export default SEO;
