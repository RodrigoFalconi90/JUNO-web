const { app } = require('@azure/functions');

const FREE = /@(gmail|hotmail|outlook|yahoo|icloud|live|proton|protonmail|aol)\./i;
const RANGOS = { lt5k: '< 5,000', '5k-20k': '5,000–20,000', '20k-100k': '20,000–100,000', gt100k: '> 100,000' };
const limpia = (v) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, 200);

app.http('demo', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'demo',
  handler: async (request, context) => {
    let d;
    try { d = await request.json(); } catch { return { status: 400, jsonBody: { error: 'Solicitud inválida.' } }; }

    if (d.website) return { status: 200, jsonBody: { ok: true } }; // honeypot: bots

    const lead = {
      nombre: limpia(d.n), empresa: limpia(d.e), suscriptores: RANGOS[d.s],
      correo: limpia(d.m).toLowerCase(), fecha: new Date().toISOString(),
    };
    const valido = lead.nombre && lead.empresa && lead.suscriptores &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.correo) && !FREE.test(lead.correo);
    if (!valido) return { status: 400, jsonBody: { error: 'Datos incompletos o correo no corporativo.' } };

    context.log('Nueva solicitud de demo', lead.empresa);

    // Reenvía el lead a Power Automate / Logic Apps / Teams / Slack / tu CRM (variable DEMO_WEBHOOK_URL)
    const url = process.env.DEMO_WEBHOOK_URL;
    if (url) {
      try {
        const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
        if (!r.ok) throw new Error('Webhook respondió ' + r.status);
      } catch (err) {
        context.error(err);
        return { status: 502, jsonBody: { error: 'No se pudo registrar la solicitud.' } };
      }
    } else {
      context.warn('DEMO_WEBHOOK_URL no está configurada: el lead solo quedó en los logs.');
    }
    return { status: 200, jsonBody: { ok: true } };
  },
});
