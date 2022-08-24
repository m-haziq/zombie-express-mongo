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

describe('tests for items ',()=>{
    test("add items in success case", async () => {
        const response = await request(app)
          .post("/item/add")
          .send(success_case_payload)
          .expect(201)
          
      });



    
    test("test add survivor in error scenario",   async()=> {
        const response =await  request(app).post("/item/add")
        .send
        (error_case_payload)
        .expect(400);
          
      });

    test("test get items",   async()=> {
        const response =await  request(app).get("/item/get")
        .expect(200);
          
      });


})