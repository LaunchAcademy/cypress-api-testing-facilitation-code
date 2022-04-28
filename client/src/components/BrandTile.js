import React from "react"
import { Link } from "react-router-dom"

const BrandTile = ({ id, name }) => {
  return(
    <div className="list">
      <h4><Link to={`/brands/${id}`}>{name}</Link></h4>
    </div>
  )
}

export default BrandTile