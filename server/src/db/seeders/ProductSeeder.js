import { Brand, Item, Product } from "../../models/index.js"

class ProductSeeder {
  static async seed() {
    const bounty = await Brand.query().findOne( "name", "Bounty" )
    const scott = await Brand.query().findOne( "name", "Scott" )
    const paperTowels = await Item.query().findOne( "name", "Paper Towels" )
    const toiletPaper = await Item.query().findOne( "name", "Toilet Paper" )

    await Product.query().insert({ brandId: bounty.id, itemId: paperTowels.id})
    await Product.query().insert({ brandId: scott.id, itemId: paperTowels.id})
    await Product.query().insert({ brandId: scott.id, itemId: toiletPaper.id})
  }
}

export default ProductSeeder