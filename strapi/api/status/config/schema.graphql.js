module.exports = {
  query: "status: Boolean!",
  resolver: {
    Query: {
      status: () => true
    }
  }
};
