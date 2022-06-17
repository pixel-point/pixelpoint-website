export default {
  servicesWebDesign: {
    title: 'Web Design — Pixel Point',
    description:
      'Get a stunning-looking website made by in-house team of motion, graphic, and web designers.',
  },
  servicesWebDevelopment: {
    title: 'Web Development — Pixel Point',
    description:
      'Have a JAMStack powered web platform built with React, third parties, and integrations at your disposal.',
  },
  about: {
    title: 'About Us - Pixel Point',
    description:
      'Learn the Pixel Point origin and the team standing behind world-class marketing websites.',
  },
  blog: {
    title: 'Our Blog — Pixel Point',
    description:
      'Collective team experience shared through articles, digests, and tutorials on web design and development.',
  },
  blogPost: ({ title, description, ogImage }) => ({
    title: `${title} — Pixel Point`,
    description,
    ogImage,
  }),
  caseStudies: {
    title: 'Case Studies — Pixel Point',
    description: 'See how we have helped our customers achieve their goals.',
  },
  caseStudy: ({ title, description }) => ({
    title: `${title} — Pixel Point`,
    description,
  }),
};
