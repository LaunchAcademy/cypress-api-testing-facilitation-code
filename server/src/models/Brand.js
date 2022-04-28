const Model = require("./Model")

class Brand extends Model {
  static get tableName(){
    return "brands"
  }

  static get jsonSchema() {
    return {
      type: "object", 
      required: ["name"],
      properties: {
        name: { type: "string"}
      }
    }
  }
}

module.exports = Brand