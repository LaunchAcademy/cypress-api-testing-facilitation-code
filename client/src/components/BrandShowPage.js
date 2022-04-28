import React, { useState, useEffect } from "react"

import ItemTile from "./ItemTile.js"

const BrandShowPage = (props) => {
  const [brand, setBrand] = useState({ items: [] })

  const id = props.match.params.id

  const getBrand = async () => {
    try {
      const response = await fetch(`/api/v1/brands/${id}`)
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw(error)
      }
      const brandData = await response.json()
      setBrand(brandData.brand)
    } catch(error) {
      console.error(`Error in fetch: ${error.message}`)
    }
  }

  useEffect(() => {
    getBrand()
  }, [])


  const itemTileComponents = brand.items.map(itemObject => {
    return(
      <ItemTile
        key={itemObject.id}
        {...itemObject}
      />
    )
  })

  return(
    <div>
      <h1>{brand.name}</h1>
      {itemTileComponents}
    </div>
  )
}

export default BrandShowPage
