/* eslint-disable no-console */
import { connection } from "../boot.js"
import configuration from "../config.js"

import BrandSeeder from "./seeders/BrandSeeder.js"
import ItemSeeder from "./seeders/ItemSeeder.js"
// import ProductSeeder from "./seeders/ProductSeeder.js"

class Seeder {
  static async seed() {
    console.log("seeding brands...")
    await BrandSeeder.seed()

    console.log("seeding items...")
    await ItemSeeder.seed()

    // console.log("seeding products...")
    // await ProductSeeder.seed()

    console.log("Done!")
    await connection.destroy()
  }
}

export default Seeder