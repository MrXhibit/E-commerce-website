import { bootstrap } from "./infrastructure/config";
import { createServer, createHttpsServer } from "./infrastructure/server";
import { env } from "./infrastructure/config/environment";

const start = async () => {
  try {
    await bootstrap();
    
    const port = parseInt(String(env.PORT), 10) || 5000;
    
    if (env.HTTPS_ENABLED) {
      // Create HTTPS server
      const httpsServer = createHttpsServer();
      httpsServer.listen(port, () => {
        console.log(`HTTPS server is running on port ${port}`);
      });
    } else {
      // Create HTTP server
      const server = createServer();
      server.listen(port, () => {
        console.log(`HTTP server is running on port ${port}`);
      });
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
