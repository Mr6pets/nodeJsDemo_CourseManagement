if (process.env.NODE_ENV == "production") {
  module.exports = {
    mongoURL: "mongodb://mongodb+srv://alvis:<password>@cluster0-rzg8n.mongodb.net/test?retryWrites=true&w=majority"
  }
} else {
  module.exports = {
    mongoURL: "mongodb://localhost/node-app"
  }
}