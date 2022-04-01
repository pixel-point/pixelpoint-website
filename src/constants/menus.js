import LINKS from 'constants/links.js';

export default {
  header: [
    {
      text: 'Services',
      items: [
        {
          iconName: 'webDesign',
          text: 'Web design',
          description:
            'Get a stunning-looking website made by in-house team of motion, graphic, and web designers.',
          linkText: 'Read more',
          to: LINKS.webDesign,
        },
        {
          iconName: 'webDevelopment',
          text: 'Web development',
          description:
            'Have a JAMStack powered web platform built with React, 3rd parties & integrations at your disposal',
          linkText: 'Read more',
          to: LINKS.webDevelopment,
        },
      ],
    },
    {
      text: 'Case studies',
      to: LINKS.caseStudies,
    },
    {
      text: 'Blog',
      to: LINKS.blog,
    },
  ],
  footer: [
    [
      { text: 'Web design', to: LINKS.webDesign },
      { text: 'Web development', to: LINKS.webDevelopment },
    ],
    [
      { text: 'Case studies', to: LINKS.caseStudies },
      { text: 'Blog', to: LINKS.blog },
    ],
    [
      { text: 'Github', to: LINKS.github },
      { text: 'Twitter', to: LINKS.twitter },
    ],
  ],
  footerSm: [
    [
      { text: 'Web design', to: LINKS.webDesign },
      { text: 'Web development', to: LINKS.webDevelopment },
      { text: 'Case studies', to: LINKS.caseStudies },
    ],
    [
      { text: 'Blog', to: LINKS.blog },
      { text: 'Github', to: LINKS.github },
      { text: 'Twitter', to: LINKS.twitter },
    ],
  ],
  mobile: [
    {
      text: 'Services',
      items: [
        {
          iconName: 'webDesign',
          text: 'Web design',
          to: LINKS.webDesign,
        },
        {
          iconName: 'webDevelopment',
          text: 'Web development',
          to: LINKS.webDevelopment,
        },
      ],
    },
    {
      text: 'Case studies',
      to: LINKS.caseStudies,
    },
    {
      text: 'Blog',
      to: LINKS.blog,
    },
  ],
};
