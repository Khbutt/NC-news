const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
    test("status: 200 responds with an array ofall topics", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
            const {topics} = body;
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    description: expect.any(String),
                    slug: expect.any(String),
                })
            })
        })
    })
    test("status 404: responds with error message when non existent path is requested", () => {
        return request(app)
        .get("/api/topics/banana")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("404 - Not Found")
        })
    })
})

