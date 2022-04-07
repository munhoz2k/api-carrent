import swaggerUi from "swagger-ui-express";

import { app } from "./app";
import { router } from "./routes";
import swaggerFile from "./swagger.json";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(router);

app.listen(3333, () => console.log("Server Up!"));
