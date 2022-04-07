/**
 * Design Confection Node js
 * @author Shuja Naqvi
 */
require("dotenv").config();
const app = require("express")();
const port = process.env.PORT || 5000;
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
require("./services/socket-io")(io);
require("./database");

// Middleware
require("./middleware/common")(app);

// API Routes
app.use("/api", require("./routes"));

// Server
server.listen(port, () => {
  console.log(`Server is running at port ${port} :)`);
});
