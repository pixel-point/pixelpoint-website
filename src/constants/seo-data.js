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
