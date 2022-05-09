import { useStaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ title, description, ogImage, canonicalUrl }) => {
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
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={siteUrl + (ogImage || siteImage)} />
      <meta property="og:type" content="website" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  ogImage: PropTypes.string,
  canonicalUrl: PropTypes.string,
};

SEO.defaultProps = {
  title: null,
  description: null,
  ogImage: null,
  canonicalUrl: null,
};

export default SEO;
