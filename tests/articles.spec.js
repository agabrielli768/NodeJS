const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const articleServices = require("../api/articles/articles.service");

describe("tester API articles", () => {
  let token;
  const USER_ID = "65a25567fa1eb2832abfa9ad";
  const ARTICLE_ID = "65a25567fa1eb2832abfa9ad";

  const MOCK_DATA_CREATED = {
    title: "title",
    user: USER_ID,
    status: "draft",
  };

  const MOCK_DATA_UPDATED = {
    id: ARTICLE_ID,
    title: "title changed",
    user: USER_ID,
    status: "draft",
  };

  const MOCK_DATA_DELETED = {
    id: ARTICLE_ID,
    title: "title deleted",
    user: USER_ID,
    status: "draft",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID, role: "admin" }, config.secretJwtToken);
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "save");
    mockingoose(Article).toReturn(MOCK_DATA_UPDATED, "findByIdAndUpdate");
    mockingoose(Article).toReturn(MOCK_DATA_DELETED, "deleteOne");
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
  });

  test("[Articles] Update Article", async () => {
    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send(MOCK_DATA_UPDATED)
      .set("x-access-token", token);

    expect(res.status).toBe(201);
  });

  
  test("[Articles] Delete Article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .send(MOCK_DATA_DELETED)
      .set("x-access-token", token);

    expect(res.status).toBe(204);
    })

});
