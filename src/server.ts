import { app } from "./app";
import { router } from "./routes";

app.use(router);

app.listen(3001, () => console.log("Server Up!"));
