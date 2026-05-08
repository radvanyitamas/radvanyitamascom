export const transition = 'server';

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Mailjet API hívás (v3.1)
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // A Mailjet Basic Auth-ot vár: API_KEY:SECRET_KEY base64-re kódolva
        'Authorization': 'Basic ' + btoa(`${import.meta.env.MAILJET_API_KEY}:${import.meta.env.MAILJET_SECRET_KEY}`)
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: import.meta.env.EMAIL_FROM_PORTFOLIO,
              Name: "Radványi Tamás Portfolio"
            },
            To: [
              {
                Email: import.meta.env.EMAIL_TO_MYSELF,
                Name: "Tamás"
              }
            ],
            ReplyTo: {
              Email: email,
              Name: name
            },
            Subject: `[Kontakt Form] ${subject || 'Új megkeresés'}`,
            HTMLPart: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #00FFCC; background: #111; padding: 10px;">Új üzenet érkezett!</h2>
                <p><strong>Név:</strong> ${name}</p>
                <p><strong>E-mail:</strong> ${email}</p>
                <hr />
                <p><strong>Üzenet:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
            `
          }
        ]
      })
    });

    const result = await response.json();

    if (response.ok) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Mailjet hiba', details: result }), { status: 400 });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Szerveroldali hiba történt' }), { status: 500 });
  }
}