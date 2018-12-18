import defaultCatalogQuery from "components/ProductGrid/defaultQuery";

/**
 *
 * @param {String} searchString - The search string
 * @returns {String} GraphQL query string
 */
export function productSearchPagination(searchString) {
  // If the search string is empty, return the default match_all query.
  if (searchString === "") {
    return defaultCatalogQuery;
  }

  return `
    {
      productSearchPagination(
        query: { 
          bool: {
            must: [{
              bool: {
                must: [{
                  bool:{
                    minimum_should_match: "1"
                    should: [
                      {
                        multi_match: {
                          fields: ["product.title"],
                          fuzziness:0
                          operator:or
                          query: "${searchString}"
                          type:best_fields
                        }
                      },
                      {
                        multi_match: {
                          fields: ["product.title"],
                          operator:or
                          query: "${searchString}"
                          type:phrase_prefix
                        }
                      }
                    ]
                  }
                }]
              }
            }]
          }
        }
        page: PAGE,
        perPage: PER_PAGE
        ) {
          count
          items {
            _score
            _source {
              id
              product {
                description
                media
                pricing
                slug
                title
                vendor
                variants {
                  _id
                  title
                  options {
                    _id
                    title
                  }
                }
              }
            }
          }
      }
    }
  `;
}
