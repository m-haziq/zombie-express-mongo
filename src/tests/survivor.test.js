jest.mock('../middleWare/auth', () => jest.fn((req, res, next) => next()))

const request = require("supertest");
const app = require("../server");


const success_case_payload = {
    name:"tester",
    age:13,
    location:{
        lat:12,
        long:12
    },
    infected:false
}

const error_case_payload = {
    email:"tester@testing.com",
    age:13,
    location:{
        lat:12,
        long:12
    },
    infected:false
}


describe('tests to add survivor ',()=>{     
    test("test to add survivor in success case", async () => {
        const response = await request(app)
          .post("/survivor/add")
          .send(success_case_payload)
          .expect(201)
      });



    
    test("test to add survivor in error case ",   async()=> {
        const response =await  request(app).post("/survivor/add")
        .send(error_case_payload)
        .expect(400);
        
          
    });

    test("test to get  infected survivors in error case ",   async()=> {
        const response =await  request(app).get("/survivor/infected")
        .expect(200)
        expect(response.res.text).toMatch('Survivors are infected')
          
    });

    test("test to get  non-infected survivors in error case ",   async()=> {
        const response =await  request(app).get("/survivor/non-infected")
        .expect(200)
        expect(response.res.text).toMatch('Survivors are non-infected')
          
    });



})