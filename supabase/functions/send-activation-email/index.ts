import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  activationUrl: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, activationUrl, userName }: EmailRequest = await req.json();

    // Get email configuration from environment
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");
    const fromEmail = Deno.env.get("FROM_EMAIL");

    if (!smtpHost || !smtpUser || !smtpPass || !fromEmail) {
      throw new Error("Missing email configuration");
    }

    const client = new SmtpClient();

    await client.connectTLS({
      hostname: smtpHost,
      port: smtpPort,
      username: smtpUser,
      password: smtpPass,
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Activate Your Account</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Celebrity Booking System</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome${userName ? `, ${userName}` : ''}!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Thank you for joining the Celebrity Booking System. To complete your registration and activate your account, please click the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${activationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        font-size: 16px; 
                        display: inline-block;">
                Activate My Account
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${activationUrl}" style="color: #667eea; word-break: break-all;">${activationUrl}</a>
            </p>
            
            <p style="color: #999; font-size: 14px; margin-top: 20px;">
              If you didn't create an account with us, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>&copy; 2024 Celebrity Booking System. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    await client.send({
      from: fromEmail,
      to: to,
      subject: "Activate Your Celebrity Booking Account",
      content: emailHtml,
      html: emailHtml,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: "Activation email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending activation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);