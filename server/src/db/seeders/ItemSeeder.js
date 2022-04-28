import { Item } from "../../models/index.js"

class ItemSeeder {
  static async seed() {
    await Item.query().insert({name: "Toilet Paper" })
    await Item.query().insert({name: "Paper Towels" })
    await Item.query().insert({name: "Soap" })
  }
}

export default ItemSeeder