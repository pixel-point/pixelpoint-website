import LINKS from 'constants/links';

export default {
  header: [
    {
      text: 'Services',
      items: [
        {
          iconName: 'webDesign',
          text: 'Web Design',
          description:
            'Get a stunning-looking website made by in-house team of motion, graphic, and web designers.',
          linkText: 'Read more',
          to: LINKS.webDesign,
        },
        {
          iconName: 'webDevelopment',
          text: 'Web Development',
          description:
            'Have a JAMStack powered web platform built with React, 3rd parties & integrations at your disposal',
          linkText: 'Read more',
          to: LINKS.webDevelopment,
        },
      ],
    },
    {
      text: 'Case Studies',
      to: LINKS.caseStudies,
    },
    {
      text: 'About Us',
      to: LINKS.about,
    },
    {
      text: 'Blog',
      to: LINKS.blog,
    },
  ],
  footer: [
    [
      { text: 'Web Design', to: LINKS.webDesign },
      { text: 'Web Development', to: LINKS.webDevelopment },
      { text: 'Case Studies', to: LINKS.caseStudies },
    ],
    [
      { text: 'About Us', to: LINKS.about },
      { text: 'Blog', to: LINKS.blog },
    ],
    [
      { text: 'GitHub', to: LINKS.github },
      { text: 'Twitter', to: LINKS.twitter },
    ],
  ],
  footerSm: [
    [
      { text: 'Web Design', to: LINKS.webDesign },
      { text: 'Web Development', to: LINKS.webDevelopment },
      { text: 'Case Studies', to: LINKS.caseStudies },
    ],
    [
      { text: 'About Us', to: LINKS.about },
      { text: 'Blog', to: LINKS.blog },
      { text: 'GitHub', to: LINKS.github },
      { text: 'Twitter', to: LINKS.twitter },
    ],
  ],
  mobile: [
    {
      text: 'Services',
      items: [
        {
          iconName: 'webDesign',
          text: 'Web Design',
          to: LINKS.webDesign,
        },
        {
          iconName: 'webDevelopment',
          text: 'Web Development',
          to: LINKS.webDevelopment,
        },
      ],
    },
    {
      text: 'Case Studies',
      to: LINKS.caseStudies,
    },
    {
      text: 'About Us',
      to: LINKS.about,
    },
    {
      text: 'Blog',
      to: LINKS.blog,
    },
  ],
};
