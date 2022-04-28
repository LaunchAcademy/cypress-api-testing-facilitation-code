import express from "express"
import objection from "objection"
const { ValidationError } = objection

import cleanUserInput from "../../../services/cleanUserInput.js"

import { Brand } from "../../../models/index.js"

const brandsRouter = new express.Router()

brandsRouter.get("/", async (req, res) => {
  try {
    const brands = await Brand.query()
    return res.status(200).json({ brands: brands })
  } catch(error){
    console.log(error)
    return res.status(500).json({ errors: error })
  }
})

brandsRouter.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const brand = await Brand.query().findById(id)
    return res.status(200).json({ brand: brand })
  } catch(error){
    return res.status(500).json({ errors: error })
  }
})

brandsRouter.post("/", async (req, res) => {
  const body = req.body
  const formInput = cleanUserInput(body)
  
  try {
    const newBrand = await Brand.query().insertAndFetch(formInput)
    return res.status(201).json({ brand: newBrand })
  } catch (error) {
    console.log(error)
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data })
    }
    return res.status(500).json({ errors: error })
  }
})

export default brandsRouter
