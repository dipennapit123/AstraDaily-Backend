import { createApp } from "./app";

const app = createApp();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on ${PORT}`);
});

