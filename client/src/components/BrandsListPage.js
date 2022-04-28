import React, { useState, useEffect } from "react"

import BrandTile from "./BrandTile.js"

const BrandsListPage = () => {
  const [brands, setBrands] = useState([])

  const getBrands = async () => {
    try {
      const response = await fetch('/api/v1/brands')
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage);
        throw(error);
      }
      const parsedResponse = await response.json()
      setBrands(parsedResponse.brands);
    } catch(err) {
      console.error(`Error in fetch: ${err.message}`)
    }
  }
  
  useEffect(() => {
    getBrands()
  }, [])

  const brandTileComponents = brands.map(brandObject => {
    return(
      <BrandTile
        key={brandObject.id}
        {...brandObject}
      />
    )
  })

  return(
    <div>
      <h2>Brands Available At Our Store</h2>
      {brandTileComponents}
    </div>
  )
}

export default BrandsListPage