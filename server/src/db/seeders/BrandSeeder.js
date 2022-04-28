import { Brand } from "../../models/index.js"

class BrandSeeder {
  static async seed() {
    await Brand.query().insert({name: "Bounty" })
    await Brand.query().insert({name: "Scott" })
    await Brand.query().insert({name: "Dove" })
  }
}

export default BrandSeeder