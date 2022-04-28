import React, { useState, useEffect } from "react"
import { Redirect } from "react-router-dom"

const BrandShowPage = (props) => {
  const [name, setName] = useState("")
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const postBrand = async (formData) => {
    try {
      const response = await fetch(`/api/v1/brands`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(formData)
      })
      const responseBody = await response.json()
      if (!response.ok) {

        console.log(responseBody)

        // display errors!
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw(error)
      }
      setShouldRedirect(true)
    } catch(error) {
      console.error(`Error in fetch: ${error.message}`)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    postBrand({ name: name})
  }

  const handleChange = (event) => {
    setName(event.target.value)
  }

  if (shouldRedirect){
  }

  return(
    <div>
      <h1>New Brand Form</h1>
      <form className="callout" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          name='name'
          onChange={handleChange}
        />
        <input className="button" type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default BrandShowPage
