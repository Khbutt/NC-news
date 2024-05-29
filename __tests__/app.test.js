const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const endpointsFile = require('../endpoints.json')

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
        .get("/api/topics/not-a-handled-route")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("404 - Not Found")
        })
    })
})
describe("GET /api", () => {
    test("status 200: responds with all available endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body.endpoints).toEqual(endpointsFile)
        })
    })
})

describe("GET /api/articles/:article_id", () => {
    test("status 200: responds with requested article", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toMatchObject({
                article_id: 1,
                author: expect.any(String),
                title: expect.any(String),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
            })
        })
    })
})

