import { BLOG_BASE_PATH } from './blog';

export default {
  servicesWebDesign: {
    title: 'Web Design — Pixel Point',
  },
  servicesWebDevelopment: {
    title: 'Web Development — Pixel Point',
  },
  about: {
    title: 'About Us - Pixel Point',
  },
  blog: {
    title: 'Our Blog — Pixel Point',
    canonicalUrl: process.env.GATSBY_DEFAULT_SITE_URL + BLOG_BASE_PATH,
  },
  blogPost: ({ title, description, ogImage }) => ({
    title: `${title} — Pixel Point`,
    description,
    ogImage,
  }),
  caseStudies: {
    title: 'Case Studies — Pixel Point',
  },
  caseStudy: ({ title, description }) => ({
    title: `${title} — Pixel Point`,
    description,
  }),
};
