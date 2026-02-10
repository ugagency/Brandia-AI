
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve os arquivos estáticos da pasta 'dist' (gerada pelo build)
app.use(express.static(path.join(__dirname, 'dist')));

// Garante que qualquer rota caia no index.html (essencial para SPAs)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`STRATYX AI rodando na porta ${PORT}`);
});
