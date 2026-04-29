const app = require('./app');
const connectToMongo = require('./mongodb/mongodb.connect');

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToMongo();

    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
