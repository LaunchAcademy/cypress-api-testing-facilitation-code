/// <reference types="cypress" />

context("/api/v1/brandsRouter", () => {
  describe("GET /api/v1/brands", () => {
    const initialBrands = [{ name: "Patagonia" }, { name: "Newman's Own" }]

    beforeEach(() => {
      cy.task("db:truncate", "Brand")
      cy.task("db:insert", { modelName: "Brand", json: initialBrands })
    })

    it("has the correct response type", () => {
      cy.request("/api/v1/brands")
        .its("headers")
        .its("content-type")
        .should("include", "application/json")
    })

    it("return the correct status code", () => {
      cy.request("/api/v1/brands").its("status").should("be.equal", 200)
    })

    it("loads 2 brands", () => {
      cy.request("/api/v1/brands").its("body.brands").should("have.length", 2)
    })

    it("has the right property name & value", () => {
      // example Response output below the `cy.request`
      // Debugging Option 1: debugger
      // async/await > then/catch

      // const response = await request("/api/va/brands")
      // response
      // cy.request("/api/v1/brands").then(($response) => {
      //   debugger
      // })

      // Debugging Option 2: .debug()
      cy.request("/api/v1/brands").debug()

      cy.request("/api/v1/brands")
        .its("body")
        .its("brands")
        .should((brands) => {
          expect(brands[0]).to.have.property("name", "Patagonia")
          // ^^ using `expect` within the callback of `should`
        })
    })

    // Response {
    //   "headers": {
    //     "content-type": "application/json"
    //   },
    //   "status": 200,
    //   "body": {
    //     "brands": [{name: "Patagonia"}, brand2]
    //   }
    // }
  })

  describe("GET /api/v1/brands/:id", () => {
    const initialBrand = { name: "Patagonia" }
    let showUrl

    beforeEach(() => {
      cy.task("db:truncate", "Brand")
      cy.task("db:insert", { modelName: "Brand", json: initialBrand })

      cy.task("db:find", { modelName: "Brand", conditions: { name: "Patagonia" } }).then(
        (brands) => {
          showUrl = `/api/v1/brands/${brands[0].id}`
        }
      )
    })

    it("has the correct response type", () => {
      cy.request(showUrl).its("headers").its("content-type").should("include", "application/json")
    })

    it("return the correct status code", () => {
      cy.request(showUrl).its("status").should("be.equal", 200)
    })

    it("returns the correct data", () => {
      cy.request(showUrl).its("body").its("brand").should("have.property", "name", "Patagonia")
    })
  })

  describe("POST /api/v1/brands", () => {
    beforeEach(() => {
      cy.task("db:truncate", "Brand")
    })

    context("when posting successfully", () => {
      it("returns the correct status", () => {
        cy.request("POST", "/api/v1/brands", { name: "Big Dog" })
          .its("status")
          .should("be.equal", 201)
      })

      it("returns the newly persisted brand", () => {
        // Option 1: should - expect (directly access `property`)
        cy.request("POST", "/api/v1/brands", { name: "Big Dog" }).should((response) => {
          expect(response.body.brand).to.have.property("name", "Big Dog")
        })

        // Option 2: its - should ("have.property")
        cy.request("POST", "/api/v1/brands", { name: "Big Dog" })
          .its("body.brand")
          .should("have.property", "name", "Big Dog")
        // { brand: { name: "Big Dog" }}
      })
    })

    context("when posting unsuccessfully", () => {
      it("returns a 422 for not provided all fields", () => {
        cy.request({
          body: { name: "" },
          method: "POST",
          url: "/api/v1/brands",
          failOnStatusCode: false,
        })
          .its("status")
          .should("be.equal", 422)
      })

      it("returns an errors object", () => {
        cy.request({
          method: "POST",
          url: "/api/v1/brands",
          body: { name: "" },
          failOnStatusCode: false,
        }).should((response) => {
          const errorsForNameField = response.body.errors.name[0]
          expect(errorsForNameField.keyword).to.be.equal("required")
          expect(errorsForNameField.message).to.be.equal("is a required property")
          expect(errorsForNameField.params.missingProperty).to.be.equal("name")
        })
      })
    })
  })
})
