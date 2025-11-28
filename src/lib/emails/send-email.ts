import { resend } from "../resend";

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  await resend.emails.send({
    from: "Eckokit Notifications <notifications@notifications.eckokit.com>", // You could add your custom domain
    to: to, // email of the user to want to end
    subject: subject, // Main subject of the email
    html: html, // Content of the email
    text: text, // Content of the email
  });
}
