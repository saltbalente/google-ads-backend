import { createHash, timingSafeEqual } from 'crypto';

// Exige la cabecera X-API-Key igual a API_SECRET_KEY. Sin la variable
// configurada, el endpoint queda cerrado (nunca abierto por descuido).
export function requireApiKey(req, res) {
  const expected = process.env.API_SECRET_KEY || '';
  if (!expected) {
    res.status(503).json({ success: false, error: 'API no configurada' });
    return false;
  }
  const given = String(req.headers['x-api-key'] || '');
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(expected).digest();
  if (!given || !timingSafeEqual(a, b)) {
    res.status(401).json({ success: false, error: 'No autorizado' });
    return false;
  }
  return true;
}
