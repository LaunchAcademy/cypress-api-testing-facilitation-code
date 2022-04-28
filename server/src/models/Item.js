const Model = require("./Model")

class Item extends Model {
  static get tableName(){
    return "items"
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

module.exports = Item