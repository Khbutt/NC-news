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
            expect(body.msg).toBe("Not Found")
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
                article_id: expect.any(Number),
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

describe("GET /api/articles", () => {
    test("status 200: responds with array of all articles with the correct properties", () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((res) => {
            const articlesArray = res.body.articles
            expect(articlesArray).toHaveLength(13)
            articlesArray.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    title: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String),
                })
                expect(article).not.toHaveProperty('body')
                expect(articlesArray).toBeSortedBy("created_at", { descending: true})
            })
        })
    })
})


describe("GET /api/articles/:article_id/comments", () => {
    test("status 200: responds with array of all comments with the correct properties", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
            const commentsArray = res.body.comments
            expect(commentsArray).toHaveLength(11)
            commentsArray.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                })
                expect(commentsArray).toBeSortedBy("created_at", { descending: true})
            })
        })
            })
        })


    describe("ERRORS - GET /api/articles/:article_id/comments", () => {
        test("GET: 200 - returns an array if passed a valid article_id that has no associated comments", () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
            console.log(body)
            expect(body.comments).toEqual([])
        })
        })
        test("GET: 400 - returns a message of 'Bad Request' when passed an invalid article_id", () => {
            return request(app)
            .get("/api/articles/invalidID/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
        })
        test("GET: 404 - returns a message of 'Not Found' when passed a valid but non-existent article_id", () => {
            return request(app)
            .get("/api/articles/1000/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found")
            })
        })
    })

    describe("POST /api/articles/:article_id/comments", () => {
        test("responds with a 201 status and responds with newly posted comment on an article", () => {
            const postObj =  {
                username: "butter_bridge",
                body: "This is a new comment",
            }
            return request(app)
            .post("/api/articles/1/comments")
            .send(postObj)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment).toMatchObject({
                    comment_id: expect.any(Number),
                    author: expect.any(String),
                    article_id: expect.any(Number),
                    votes: expect.any(Number),
                    body: expect.any(String),
                })
            })
        })
    })

    describe("POST /api/articles/:article_id/comments", () => {
        test("POST: 400 - returns a message of 'Bad Request' when passed an invalid article_id", () => {
            return request(app)
            .post("/api/articles/invalidID/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
        })
        test("GET: 404 - returns a message of 'Not Found' when passed a valid but non-existent article_id", () => {
            return request(app)
            .post("/api/articles/100/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found")
            })
        })
    })
