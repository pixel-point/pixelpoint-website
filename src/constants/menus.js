const links = {
  webDesign: '/services/web-design/',
  webDevelopment: '/services/web-development/',
  caseStudies: '/case-studies/',
  blog: '/blog/',
  github: 'https://github.com/pixel-point',
  twitter: 'https://twitter.com/alex_barashkov',
};

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
          to: links.webDesign,
        },
        {
          iconName: 'webDevelopment',
          text: 'Web development',
          description:
            'Have a JAMStack powered web platform built with React, 3rd parties & integrations at your disposal',
          linkText: 'Read more',
          to: links.webDevelopment,
        },
      ],
    },
    {
      text: 'Case studies',
      to: links.caseStudies,
    },
    {
      text: 'Blog',
      to: links.blog,
    },
  ],
  footer: [
    [
      { text: 'Web design', to: links.webDesign },
      { text: 'Web development', to: links.webDevelopment },
    ],
    [
      { text: 'Case studies', to: links.caseStudies },
      { text: 'Blog', to: links.blog },
    ],
    [
      { text: 'Github', to: links.github },
      { text: 'Twitter', to: links.twitter },
    ],
  ],
  footerSm: [
    [
      { text: 'Web design', to: links.webDesign },
      { text: 'Web development', to: links.webDevelopment },
      { text: 'Case studies', to: links.caseStudies },
    ],
    [
      { text: 'Blog', to: links.blog },
      { text: 'Github', to: links.github },
      { text: 'Twitter', to: links.twitter },
    ],
  ],
  mobile: [
    {
      text: 'Services',
      items: [
        {
          iconName: 'webDesign',
          text: 'Web design',
          to: links.webDesign,
        },
        {
          iconName: 'webDevelopment',
          text: 'Web development',
          to: links.webDevelopment,
        },
      ],
    },
    {
      text: 'Case studies',
      to: links.caseStudies,
    },
    {
      text: 'Blog',
      to: links.blog,
    },
  ],
};
