module.exports = {
  query: "blogBySlug(slug: String!): Blog",
  resolver: {
    Query: {
      blogBySlug: {
        description: "Return a blog post by the slug",
        resolverOf: "Blog.findOne",
        resolver: "Blog.findBySlug"
      }
    }
  }
};
