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
      const { email, whatsapp } = req.body;
      if (!email) return res.status(400).json({ error: 'Correo requerido' });

      await registros.updateOne(
        { email: email.toLowerCase().trim() },
        {
          $setOnInsert: {
            email: email.toLowerCase().trim(),
            whatsapp: whatsapp || '',
            fecha: new Date(),
          },
        },
        { upsert: true },
      );

      return res.status(201).json({ ok: true });
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
