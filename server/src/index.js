const app = require("../api/index");
const { PORT } = require("./config/env");

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});