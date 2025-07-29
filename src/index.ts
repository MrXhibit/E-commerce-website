import { bootstrap } from "./infrastructure/config";
import { createServer } from "./infrastructure/server";

const start = async () => {
  try {
    await bootstrap();
    const server = createServer();
    const port = 3000;
    server.listen(port, () => console.log("server is running", port));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
