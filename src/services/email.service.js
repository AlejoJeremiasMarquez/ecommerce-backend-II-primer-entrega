import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de Contraseña - E-commerce',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid: #ffc107;
              padding: 15px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Recuperación de Contraseña</h2>
            <p>Hola,</p>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para continuar:</p>
            
            <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora.
            </div>
            
            <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
            
            <p>Saludos,<br>El equipo de E-commerce</p>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error enviando email:', error);
      throw new Error('No se pudo enviar el email de recuperación');
    }
  }

  async sendPurchaseConfirmation(email, ticket) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Confirmación de Compra - Ticket #${ticket.code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .ticket-info {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .total {
              font-size: 24px;
              color: #667eea;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>¡Gracias por tu compra!</h2>
            <p>Tu pedido ha sido procesado exitosamente.</p>
            
            <div class="ticket-info">
              <p><strong>Código de compra:</strong> ${ticket.code}</p>
              <p><strong>Fecha:</strong> ${new Date(ticket.purchase_datetime).toLocaleString('es-AR')}</p>
              <p><strong>Total:</strong> <span class="total">$${ticket.amount.toFixed(2)}</span></p>
            </div>
            
            <p>Recibirás una notificación cuando tu pedido sea enviado.</p>
            
            <p>Saludos,<br>El equipo de E-commerce</p>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error enviando email de confirmación:', error);
      // No lanzar error aquí para no interrumpir la compra
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();