const http = require("http");
const app = require("./app");

const server = http.createServer(app);

app.listen(3001, () => {
  console.log("User Service is running on port 3001");
});
