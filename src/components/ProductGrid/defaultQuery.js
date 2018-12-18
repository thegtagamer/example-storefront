export default `
{
  productSearchPagination(
    query: { match_all:{} }, 
    page: PAGE,
    perPage: PER_PAGE
  ) 
  {
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
              optionTitle
            }
          }
        }
      }
    }
  }
}
`;
