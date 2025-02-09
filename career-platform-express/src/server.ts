import app from './app';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
