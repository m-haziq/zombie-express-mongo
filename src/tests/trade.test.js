const mockmongoose =  require('mongoose')


jest.mock('../middleWare/auth', () => jest.fn((req, res, next) => {
    next()
}))
jest.mock('../middleWare/infectedStatus', () => jest.fn((req, res, next) => {
    return res.status(400).send('You are not allowed to interact with the system.');
}))
jest.mock('../middleWare/tradeValidator', () => jest.fn((req, res, next) => next()))

const request = require("supertest");
const app = require("../server");





const user_to_trade_with = mockmongoose.Types.ObjectId(1)



const trade_payload = {
    "offerd":{
        "items":[{
            "quantity":1,
            "item":"6305cdd2613025d1fa8ce9bc"
        }]
    },
    "demand":{
        "items":[{
            "quantity":1,
            "item":"63036427d844b870cb88e242"
        }]
    }
}


jest.setTimeout(10000)



describe('tests for trading ',()=>{     
   
    test("trade in case user is infected", async () => {
        
        let response = await request(app)
          .post(`/trade/${user_to_trade_with}`)
          .send(trade_payload)
          .expect(400)

      });



})