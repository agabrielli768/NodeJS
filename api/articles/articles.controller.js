const NotFoundError = require("../../errors/not-found");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const articlesService = require("./articles.service");

class ArticlesController {
  async create(req, res, next) {
    try {
      const data = {
        ...req.body,
        user: req.user.userId,
      };
      const article = await articlesService.create(data);
      res.status(201).json(article);
      req.io.emit("article:create", article);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        res.status(403).json({ error: "Accès interdit" });
      } else {
        const id = req.params.id;
        const data = req.body;
        const articleModified = await articlesService.update(id, data);

        res.status(201).json(articleModified);
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        res.status(403).json({ error: "Accès interdit" });
      } else {
        const id = req.params.id;
        await articlesService.delete(id);
        req.io.emit("article:delete", { id });
        res.status(204).send();
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
