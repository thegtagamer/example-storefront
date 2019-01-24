export default {
  aggregations: { },
  components: [
    "search",
    "searchResultCard"
  ],
  dependencyTree: {
    searchResultCard: {
      and: [
        "search",
        "searchResultCard__internal"
      ]
    }
  },
  hits: {
    searchResultCard: {
      hits: [
        {
          _id: "{\"schema\":{\"type\":\"string\",\"optional\":true},\"payload\":\"SLHLdsuDC7GC7e7ZF\"}",
          _index: "reaction.cdc.reaction.catalog.json-gen1",
          _score: 1,
          _source: {
            createdAt: {
              $date: 1529949685744
            },
            id: "SLHLdsuDC7GC7e7ZF",
            product: {
              _id: "cDK6tACKc7XETTzaX",
              createdAt: {
                $date: 1529944079296
              },
              inventoryAvailableToSell: 109,
              inventoryInStock: 109,
              isBackorder: false,
              isDeleted: false,
              isLowQuantity: false,
              isSoldOut: false,
              isTaxable: false,
              isVisible: true,
              media: [
                {
                  URLs: {
                    original: "/assets/files/Media/3n5NL2JjoC9j6BbBa/image/lucas-lenzi-573687-unsplash.jpg"
                  },
                  priority: 0,
                  productId: "cDK6tACKc7XETTzaX",
                  toGrid: 1,
                  variantId: "mSdE7aaBjEMGbBK5P"
                }
              ],
              price: {
                max: 24.99,
                min: 24.99,
                range: "24.99"
              },
              pricing: {
                USD: {
                  compareAtPrice: null,
                  displayPrice: "$24.99",
                  maxPrice: 24.99,
                  minPrice: 24.99,
                  price: null
                }
              },
              primaryImage: {
                URLs: {
                  original: "/assets/files/Media/3n5NL2JjoC9j6BbBa/image/lucas-lenzi-573687-unsplash.jpg"
                },
                priority: 0,
                productId: "cDK6tACKc7XETTzaX",
                toGrid: 1,
                variantId: "mSdE7aaBjEMGbBK5P"
              },
              productId: "cDK6tACKc7XETTzaX",
              shopId: "J8Bhq3uTtdgwZx3rz",
              slug: "thankful-t-shirt",
              supportedFulfillmentTypes: [
                "shipping"
              ],
              tagIds: [
                "4jevtBGXLz2BF8Lf8",
                "sjrKzMBz7HkX3ZSM7"
              ],
              title: "Thankful T-Shirt",
              type: "product-simple",
              updatedAt: {
                $date: 1537534660365
              },
              variants: [
                {
                  _id: "mSdE7aaBjEMGbBK5P",
                  canBackorder: false,
                  createdAt: {
                    $date: 1537534660386
                  },
                  height: 1,
                  index: 0,
                  inventoryAvailableToSell: 109,
                  inventoryInStock: 109,
                  inventoryManagement: true,
                  inventoryPolicy: false,
                  isBackorder: false,
                  isLowQuantity: false,
                  isSoldOut: false,
                  isTaxable: true,
                  length: 1,
                  lowInventoryWarningThreshold: 0,
                  media: [
                    {
                      URLs: {
                        original: "/assets/files/Media/3n5NL2JjoC9j6BbBa/image/lucas-lenzi-573687-unsplash.jpg"
                      },
                      priority: 0,
                      productId: "cDK6tACKc7XETTzaX",
                      toGrid: 1,
                      variantId: "mSdE7aaBjEMGbBK5P"
                    }
                  ],
                  optionTitle: "Untitled Option",
                  options: [
                    {
                      _id: "9kGk3W8CjjqyHtzM2",
                      canBackorder: false,
                      createdAt: {
                        $date: 1537534660386
                      },
                      height: 0,
                      index: 0,
                      inventoryAvailableToSell: 90,
                      inventoryInStock: 90,
                      inventoryManagement: true,
                      inventoryPolicy: true,
                      isBackorder: false,
                      isLowQuantity: false,
                      isSoldOut: false,
                      isTaxable: true,
                      length: 0,
                      lowInventoryWarningThreshold: 0,
                      media: [],
                      optionTitle: "Large",
                      price: 24.99,
                      pricing: {
                        USD: {
                          compareAtPrice: 27.99,
                          displayPrice: "$24.99",
                          maxPrice: 24.99,
                          minPrice: 24.99,
                          price: 24.99
                        }
                      },
                      primaryImage: null,
                      shopId: "J8Bhq3uTtdgwZx3rz",
                      taxCode: "0000",
                      title: "Large",
                      updatedAt: {
                        $date: 1537534660386
                      },
                      variantId: "9kGk3W8CjjqyHtzM2",
                      weight: 0,
                      width: 0
                    }
                  ],
                  originCountry: "US",
                  price: 24.99,
                  pricing: {
                    USD: {
                      compareAtPrice: 27.99,
                      displayPrice: "$24.99",
                      maxPrice: 24.99,
                      minPrice: 24.99,
                      price: 24.99
                    }
                  },
                  primaryImage: {
                    URLs: {
                      original: "/assets/files/Media/3n5NL2JjoC9j6BbBa/image/lucas-lenzi-573687-unsplash.jpg"
                    },
                    priority: 0,
                    productId: "cDK6tACKc7XETTzaX",
                    toGrid: 1,
                    variantId: "mSdE7aaBjEMGbBK5P"
                  },
                  shopId: "J8Bhq3uTtdgwZx3rz",
                  taxCode: "0000",
                  title: "Men's",
                  updatedAt: {
                    $date: 1537534660386
                  },
                  variantId: "mSdE7aaBjEMGbBK5P",
                  weight: 1,
                  width: 10
                }
              ],
              vendor: "Blessed Clothing"
            },
            shopId: "J8Bhq3uTtdgwZx3rz"
          },
          _type: "catalog"
        }
      ],
      time: 1,
      total: 30
    }
  },
  queryList: {
    search: null
  },
  queryOptions: {
    searchResultCard: {
      from: 0,
      size: 1
    }
  },
  selectedValues: {
    search: {
      URLParams: false,
      label: "search",
      showFilter: true
    },
    searchResultCard: {
      URLParams: false,
      label: "searchResultCard",
      showFilter: true
    }
  }
};
