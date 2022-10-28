const query = `{
  allMdx(filter: {fields: {isDraft: {eq: false}}, fileAbsolutePath: {regex: "/posts/"}}, sort: { order: DESC, fields: slug }) {
    nodes {
      id
      slug
      frontmatter {
        title
        category
        tags
        cover {
          childImageSharp {
            gatsbyImageData(width: 100)
          }
        }
      }
    }
  }
}`;

const queries = [
  {
    query,
    transformer: ({ data }) =>
      data.allMdx.nodes.map(({ id, slug, frontmatter: { title, category, cover, tags } }) => ({
        objectID: id,
        title,
        category,
        cover,
        slug,
        tags,
      })),
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
    settings: {
      attributesToSnippet: [`title:20`],
      attributesForFaceting: [`title`, `category`, `slug`, `tags`],
      customRanking: [`desc(slug)`],
    },
    matchFields: ['title', 'category'],
  },
];

module.exports = queries;
