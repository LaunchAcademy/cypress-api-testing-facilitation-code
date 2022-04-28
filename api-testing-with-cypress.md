In this lesson, we'll examine using Cypress testing for ensuring that our internal API endpoints are returning the data that we want. 

### Getting Started

```
et get api-testing-with-cypress
cd api-testing-with-cypress
createdb api-testing-with-cypress_development
createdb api-testing-with-cypress_e2e
yarn install

cd server

yarn run migrate:latest
yarn run db:e2e:migrate
yarn run db:seed

cd ..
yarn run dev:cypress
```

Ensure that you are comfortable opening multiple tabs. We'll need one for our e2e dev server (for booting up an app that will be tested by Cypress) and one for our running our Cypress tests. 

### Reviewing Our Endpoints

This application is built around a database that manages popular "brands" and the "items" that belong to those brand names. 

The endpoints in this application exist on the `brandsRouter`. Specifically: 
* GET `/api/v1/brands` for retrieving a list of brands
* GET `/api/v1/brands/:id` for retrieving a specific brand and its associated items
* POST `/api/v1/brands` for persisting a new brand and getting the newly persisted brand back in a response

```js
// server/src/routers/brandsRouter.js
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
  
  try {
    const newBrand = await Brand.query().insertAndFetch(body)
    return res.status(201).json({ brand: newBrand })
  } catch (err) {
    return res.status(500).json({ errors: err })
  }
})
export default brandsRouter
```

The goal with our API tests will be to primarily ensure that these endpoints are returning JSON responses with the correct format and data after being seeded. We'll need to ensure that our tests pre-seed brand data for the first two endpoints. For the third, we'll need to ensure we can send a POST request to the endpoint, and then observe that the newly persisted Brand comes back in a response. 

### What We Should Test

We want to ensure that the data that will be returned when we make a Fetch request to our endpoints is returned as expected. We will often want to ensure we test for: 

* the content type of the response: to ensure that this endpoint correctly response with JSON
* the status code of the response: to ensure that the endpoint is working correctly
* any dynamic information in the body of the response

For the last item, we'll have to make an informed decision regarding what information to test. Ideally, our test should work for various permutations of the brands in our database and cover notable edge cases.

### Testing GET Endpoints

Let's examine the first test provided, and the setup that we have for our GET "/api/v1/brands" endpoint. 

Before digging into the test, we suggest opening up a tab in your browser and visiting `localhost:8765/api/v1/brands` so that you will have reference of the JSON data we are ensuring is present.

```js
// e2e/cypress/integration/api/brandsRouter.spec.js

describe("GET /brands", () => {
    const initialBrands = [{ name: "Patagonia" }, { name: "Newman's Own" }]

    beforeEach(() => {
      cy.task("db:truncate", "Brand")
      cy.task("db:insert", { modelName: "Brand", json: initialBrands})
    })
    
    it("has the correct response type", () => {
      cy.request("/api/v1/brands")
        .its("headers")
        .its("content-type")
        .should("include", "application/json")
    })
    //
```

* `describe("GET /brands",` documents that the scope of the following tests will be for this specific endpoint. Other endpoints will have their own `describe` block. 

* Our `beforeEach` function run before each `it` block. It will delete any existing brands in our database, and then insert `Patagonia` and `Newman's Own` as two separate brands. 

Our first test asserts that the response should be of the type "json" (rather than HTML)

* `cy.request()` informs Cypress to make an HTTP request to the provided path. The return of this function is the JSON response from our endpoint. This response is an object with a nested data structure that has our brand data, in addition to many other response headers. 
* `its()` can be called on any object. As such, the two `its()` calls help us target the "content-type" header nested under "headers"
* `.should()` helps us make our test assertion that the response is of the time JSON, or more specifically `"application/json"`

A majority of our simpler GET requests will be built exactly in this way, with many of the same Cypress helper functions. 

```js
  it("return the correct status code", () => {
      cy.request("/api/v1/brands")
        .its("status")
        .should("be.equal", 200)
    })

```
In this, we assert the status code is 200. The only change here from earlier is that we use the `be.equal` assertion to test that things exactly match. You can find more about [Cypress assertions in their documentation](https://docs.cypress.io/guides/references/assertions#BDD-Assertions).

```js
  it("loads 2 brands", () => {
      cy.request("/api/v1/brands")
        .its("body")
        .its("brands")
        .should("have.length", 2)
    })

   it("has the right property name property & value", () => {
      cy.request("/api/v1/brands")
        .its("body")
        .its("brands")
        .should((brands) => {
          expect(brands[0]).to.have.property("name", "Patagonia")
        })
    })
```

Our final two tests for the endpoint make assertions about the response body. The first checks to make sure that the length of brand object returned matches the number of objects in the database. 

In the second spec, we pass a callback function to our usual `should()` statement. This allows us slightly better management of our `brands` data such that we can make an assertion against the first to have key name of "Patagonia". We could use other matchers to perform the same operation, but being able to work with callback function in this way is an important insight into using Cypress like a pro.

You can read more about this pattern [here](https://docs.cypress.io/api/commands/should#Function)

And that's really what we should know for now for our GET endpoints. The `"GET /brands/:id"` doesn't introduce anything knew. Do note: we ensure that we have access to the `id` of the brand we've seeded to our test database using `.then` in `beforeEach`, which ensures that our insert Objection query resolves and returns said `id` value. This allows one to visit the page of the newly created brand. 

### Testing POST Endpoints 

For our POST endpoints (as well as for a DELETE or PATCH endpoint), we'll need to do a bit more work to ensure that our requests are being sent correctly. Let's examine the first spec for the `POST "/api/v1/brands"` endpoint, which is for the "happy" or successful form submission story.

```js
    describe("when posting successfully", () => {
      it("returns the correct status", () => {
        cy.request("POST", "/api/v1/brands", { name: "Big Dog" })
        .its("status")
        .should("be.equal", 201)
      })
      // ...
    })
```
Our test assertion is nearly the same as our GET endpoints (aside from asserting a status of 201 for a created entity). However. `cy.request` defaults to "GET", so we need to pass in additional parameters to change the request to a "POST" with a body. Cypress elegantly allows us to pass each of these options as arguments. The first option being the method/verb, the second being the path, and the third is the body of the request we wish to have sent along to our endpount (in this case, the brand name "Big Dog"). 

If we look at the second POST spec, we'll notice that we once again pass a callback function to our `.should()` statement so that we can have fine tuned control of our assertion.

```js
it("returns the newly persisted brand", () => {
    cy.request("POST", "/api/v1/brands", { name: "Big Dog" }).should(
      (response) => {
        expect(response.body.brand).to.have.property("name", "Big Dog")
      }
    )
  })
```

In this spec, we use the "have property" assertion, to assert the key/value pair we wish to see in the returned brand object. We could have made an assertion against the entire object as well!

#### Testing the Sad Path of POST 

In addition to testing that our new brand is created successfully, we also want to control for the edge case of the user not properly filling out their form. "name" is a required property for a brand, so let's test that we get the appropriate error messages when sending malformed data that omits "name" to our endpoint. 

```js
   describe("when posting unsuccessfully", () => {
      it("returns the newly persisted brand", () => {
        cy.request({ 
          method: "POST", 
          url: "/api/v1/brands", 
          body: { name: "" },  
          failOnStatusCode: false 
        })
        .its("status")
        .should("be.equal", 422)
      })
```

Cypress will automatically throw an error if it receives anything beyond a 2XX or 3XX status code. As a result, we have to pass an option of `failOnStatusCode: false` into the `.request()` method. This is one of the many "extra" options that we can pass to `.request()`, that must be passed in as a part of an object. As a result, we need to designate each of our parameters with a key e.g. method, url, body, failOnStatusCode. 

Once we've set that up, we can assert that sending a request body with no name does indeed return a status code of "422" (unprocessible entity). 

Our last spec checks to see that the errors object we receive is structured correctly and with the right values. 

```js
it("returns the newly persisted brand", () => {
        cy.request({ 
          method: "POST", 
          url: "/api/v1/brands", 
          body: { name: "" },  
          failOnStatusCode: false 
        }).should((response) => {
            const errorsForNameField = response.body.errors.name[0]
            expect(errorsForNameField.keyword).to.be.equal("required")
            expect(errorsForNameField.message).to.be.equal("is a required property")
            expect(errorsForNameField.params.missingProperty).to.be.equal("name")
          }
        )
      })
```
While this spec is slightly longer, it doesn't introduce any new Cypress helpers. Rather, this spec shows us how when passing a callback function to `.should()`, we can actually add numerous expect statements to the callback function. Otherwise, we would have to setup multiple tests to assert that each key is correct, or use different matchers to test the equality of our entire `errors` object. Both are acceptable, but this spec implementation is precise and DRY. 


### Summary 

In this lesson, we reviewed how we can use Cypress for testing API endpoints. Specifically, we examined what things to test for on API endpoints, the essential matchers needed in order to make our test assertions, how to change the way the way that requests are made in cypress, and how to get more fine tuned control over the objects we are making assertions against. 


