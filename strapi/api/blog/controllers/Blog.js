"use strict";

const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findBySlug({ params: { _slug: slug } }) {
    const post = await strapi.services.blog.findOne({ slug });

    return post ? sanitizeEntity(post, { model: strapi.models.blog }) : null;
  }
};
