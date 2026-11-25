import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await client.connect();
    const registros = client.db('JUNO_DB').collection('registros');

    if (req.method === 'POST') {
      const body = req.body || {};
      const rawEmail = typeof body.correo === 'string' ? body.correo : body.email;
      if (typeof rawEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail.trim())) {
        return res.status(400).json({ error: 'Correo válido requerido' });
      }

      const clean = (value, max = 1000) => typeof value === 'string' ? value.trim().slice(0, max) : '';
      const email = rawEmail.trim().toLowerCase();
      const telefono = clean(body.telefono, 40);
      const solicitud = {
        email,
        nombre: clean(body.nombre, 160),
        empresa: clean(body.empresa, 200),
        telefono,
        whatsapp: clean(body.whatsapp, 40) || (body.contacto === 'whatsapp' ? telefono : ''),
        suscriptores: clean(body.suscriptores, 40),
        sistema: clean(body.sistema, 100),
        contacto: clean(body.contacto, 40),
        mensaje: clean(body.mensaje, 3000),
        aviso: body.aviso === true,
        folio: clean(body.folio, 80),
        origen: clean(body.origen, 80),
        fecha: new Date(),
      };

      await registros.updateOne(
        { email },
        { $set: solicitud, $setOnInsert: { creado: new Date() } },
        { upsert: true },
      );

      return res.status(201).json({ ok: true, folio: solicitud.folio || undefined });
    }

    if (req.method === 'GET') {
      const total = await registros.countDocuments();
      return res.status(200).json({ total });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
