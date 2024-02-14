const { Schema, model } = require("mongoose");

const articleSchema = Schema({
  title: String,
  content: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  }
});

let Article;

module.exports = Article = model("Article", articleSchema);



