import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

const allowedTypes = ["deposit", "transfer", "exchange"];

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          error: "METHOD_NOT_ALLOWED",
          message: "Método no permitido",
        }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const expectedSecret = process.env.EMAIL_FUNCTION_SECRET;
    const receivedSecret = request.headers.get("x-email-secret");

    if (!expectedSecret || receivedSecret !== expectedSecret) {
      return new Response(
        JSON.stringify({
          error: "UNAUTHORIZED",
          message: "Acceso no autorizado",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    try {
      const body = await request.json();

      const {
        email,
        type,
        fromAmount,
        fromCurrency,
        toAmount,
        toCurrency,
        timestamp,
      } = body;

      if (
        typeof email !== "string" ||
        typeof type !== "string" ||
        !allowedTypes.includes(type) ||
        typeof fromAmount !== "number" ||
        typeof fromCurrency !== "string" ||
        typeof toAmount !== "number" ||
        typeof toCurrency !== "string"
      ) {
        return new Response(
          JSON.stringify({
            error: "INVALID_INPUT",
            message: "Datos de la operación inválidos",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const operationLabels: Record<string, string> = {
        deposit: "Depósito",
        transfer: "Transferencia",
        exchange: "Intercambio",
      };

      const operationLabel = operationLabels[type];

      const operationDate = timestamp
        ? new Date(timestamp).toLocaleString("es-AR")
        : new Date().toLocaleString("es-AR");

      const subject = `NomadWallet - ${operationLabel} confirmado`;

      const textBody = `
Tu operación fue completada correctamente.

Operación: ${operationLabel}
Monto origen: ${fromAmount} ${fromCurrency}
Monto destino: ${toAmount} ${toCurrency}
Fecha: ${operationDate}

NomadWallet
Tu dinero, sin fronteras.
      `.trim();

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>NomadWallet</h2>
          <p>Tu operación fue completada correctamente.</p>

          <p><strong>Operación:</strong> ${operationLabel}</p>
          <p><strong>Monto origen:</strong> ${fromAmount} ${fromCurrency}</p>
          <p><strong>Monto destino:</strong> ${toAmount} ${toCurrency}</p>
          <p><strong>Fecha:</strong> ${operationDate}</p>

          <hr />
          <p>Tu dinero, sin fronteras.</p>
        </div>
      `;

      const command = new SendEmailCommand({
        Source: process.env.SES_FROM_EMAIL,
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
          Body: {
            Text: {
              Charset: "UTF-8",
              Data: textBody,
            },
            Html: {
              Charset: "UTF-8",
              Data: htmlBody,
            },
          },
        },
      });

      await sesClient.send(command);

      return new Response(
        JSON.stringify({
          sent: true,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("SES email error:", error);

      return new Response(
        JSON.stringify({
          error: "EMAIL_ERROR",
          message: "No se pudo enviar el email de confirmación",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};