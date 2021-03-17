export function mapOfferModelToOfferForm (offer, rootCategories, subCategories) {
  const category = setCategories(offer.category_id, rootCategories, subCategories)
  return {
    title: offer.title,
    category: category.root_category,
    subcategory: category.sub_category,
    price: offer.price / 100,
    description: offer.description,
    date: '',
    location: [
      offer.location.lat,
      offer.location.lon,
      offer.location.name
    ],
    mainImage: [],
    images: offer.photos,
    user: {
      account_type: 'private',
      name: '',
      email: '',
      password: '',
      rePassword: ''
    },
    links: {
      video: offer.links.video,
      video_2: offer.links.video_2,
      walk_video: offer.links.walk_video
    },
    visibleFromDate: offer.visible_from_date,
    attributes: {
      1: getAttributeValue(1, offer.attributes),
      2: isTrue(getAttributeValue(2, offer.attributes)),
      3: getAttributeValue(3, offer.attributes),
      4: getAttributeValue(4, offer.attributes),
      5: isTrue(getAttributeValue(5, offer.attributes)),
      6: isTrue(getAttributeValue(6, offer.attributes)),
      7: isTrue(getAttributeValue(7, offer.attributes)),
      8: isTrue(getAttributeValue(8, offer.attributes)),
      9: getAttributeValue(9, offer.attributes),
      10: getAttributeValue(10, offer.attributes),
      11: getAttributeValue(11, offer.attributes),
      12: getAttributeValue(12, offer.attributes),
      13: getAttributeValue(13, offer.attributes),
      14: getAttributeValue(14, offer.attributes),
      15: getAttributeValues(15, offer.attributes),
      16: getAttributeValues(16, offer.attributes),
      17: getAttributeValues(17, offer.attributes),
      18: getAttributeValue(18, offer.attributes),
      19: getAttributeValue(19, offer.attributes),
      20: isTrue(getAttributeValue(20, offer.attributes))
    }
  }
}

function getAttributeValue (id, attributes) {
  const attribute = attributes.find(attr => attr.id === id)
  if (attribute) {
    return attribute.value
  } else {
    return ''
  }
}

function getAttributeValues (id, attributes) {
  const attributeValues = attributes.filter(attr => attr.id === id).map(function (attr) {
    if (attr) {
      return attr.value
    }
  })
  if (attributeValues) {
    return attributeValues
  } else {
    return []
  }
}

function setCategories (categoryId, rootCategories, subCategories) {
  let rootCategory = ''
  let subCategory = ''
  for (const category of rootCategories) {
    if (category.id === categoryId) {
      rootCategory = category.value
    } else {
      for (const _subCategory of subCategories[category.value]) {
        if (_subCategory.id === categoryId) {
          rootCategory = category.value
          subCategory = _subCategory.value
        }
      }
    }
  }
  return {
    sub_category: subCategory,
    root_category: rootCategory
  }
}

function isTrue (value) {
  return value === 'true'
}

export function buildSearchQuery (searchParams) {
  const params = {}

  for (const searchParam in searchParams) {
    if (Object.prototype.hasOwnProperty.call(searchParams, searchParam)) {
      if (searchParams[searchParam] instanceof Object) {
        if (searchParams[searchParam].min) {
          params[searchParam + '[min]'] = searchParams[searchParam].min
        }
        if (searchParams[searchParam].max) {
          params[searchParam + '[max]'] = searchParams[searchParam].max
        }

        if (
          searchParam === 'category' &&
          searchParams[searchParam][searchParams[searchParam].length - 1] !== undefined
        ) {
          params[searchParam] = searchParams[searchParam][searchParams[searchParam].length - 1]
        }

        if (
          searchParam === 'location' &&
          searchParams[searchParam].lat !== null &&
          searchParams[searchParam].long !== null
        ) {
          params[searchParam + '[lat]'] = searchParams[searchParam].lat
          params[searchParam + '[lon]'] = searchParams[searchParam].lon
          params[searchParam + '[display_name]'] = searchParams[searchParam].display_name
        }

        if (searchParams[searchParam].length > 0) {
          for (const localParam in searchParams[searchParam]) {
            params[searchParam + `[${localParam}]`] = searchParams[searchParam][localParam]
          }
        }
      } else if (searchParams[searchParam] !== '' && searchParams[searchParam] !== null) {
        params[searchParam] = searchParams[searchParam]
      }
    }
  }

  return params
}

export function fromSearchQueryStringToFromData (query) {
  const search = {
    typ: 'typ' in query ? query.typ : '',
    pilne: 'pilne' in query ? query.pilne === 'true' : '',
    'na-raty': 'na-raty' in query ? query['na-raty'] === 'true' : '',
    'rachunki-wliczone': 'rachunki-wliczone' in query ? query['rachunki-wliczone'] === 'true' : '',
    category: 'category' in query ? query.category : '',
    price: {
      min: null,
      max: null
    },
    metraz: {
      min: null,
      max: null
    },
    location: {
      lat: null,
      lon: null
    },
    dodatkowe: {}
  }

  if ('dodatkowe[garaz]' in query) {
    search.dodatkowe.garaz = query['dodatkowe[garaz]'] === 'true'
  }

  if ('dodatkowe[umeblowane]' in query) {
    search.dodatkowe.umeblowane = query['dodatkowe[umeblowane]'] === 'true'
  }

  if ('dodatkowe[winda]' in query) {
    search.dodatkowe.winda = query['dodatkowe[winda]'] === 'true'
  }

  if ('dodatkowe[parking]' in query) {
    search.dodatkowe.parking = query['dodatkowe[parking]'] === 'true'
  }

  if ('price[min]' in query) {
    search.price.min = parseInt(query['price[min]'])
  }

  if ('price[max]' in query) {
    search.price.max = parseInt(query['price[max]'])
  }

  if ('metraz[min]' in query) {
    search.metraz.min = parseInt(query['metraz[min]'])
  }

  if ('metraz[max]' in query) {
    search.metraz.max = parseInt(query['metraz[max]'])
  }

  if ('location[lat]' in query) {
    search.location.lat = parseFloat(query['location[lat]'])
  }

  if ('location[lon]' in query) {
    search.location.lon = parseFloat(query['location[lon]'])
  }

  if ('location[display_name]' in query) {
    search.location.display_name = query['location[display_name]']
  }

  return search
}
