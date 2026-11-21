import 'dotenv/config';
import app from './src/app';

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`ControlLabs API disponible en http://localhost:${PORT}`);
});