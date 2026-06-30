import { resend, EMAIL_FROM } from "./resend";

type Send = { to: string };

function wrap(title: string, body: string, cta?: { url: string; label: string }) {
  return `
  <div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px">
    <h2 style="color:#111">${title}</h2>
    <p style="color:#444;line-height:1.6">${body}</p>
    ${
      cta
        ? `<a href="${cta.url}" style="display:inline-block;margin-top:16px;
             background:#111;color:#fff;padding:10px 18px;border-radius:8px;
             text-decoration:none">${cta.label}</a>
           <p style="color:#888;font-size:12px;margin-top:16px">
             Or paste this link: ${cta.url}</p>`
        : ""
    }
  </div>`;
}

export async function sendVerificationEmail({ to, url }: Send & { url: string }) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "Verify your email",
    html: wrap("Confirm your email", "Click below to verify your address.", {
      url,
      label: "Verify email",
    }),
  });
}

export async function sendResetPasswordEmail({ to, url }: Send & { url: string }) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "Reset your password",
    html: wrap("Reset your password", "Click below to choose a new password.", {
      url,
      label: "Reset password",
    }),
  });
}

export async function sendMagicLinkEmail({ to, url }: Send & { url: string }) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "Your magic sign-in link",
    html: wrap("Sign in", "Click below to sign in. Link expires shortly.", {
      url,
      label: "Sign in",
    }),
  });
}

export async function sendOtpEmail({ to, otp }: Send & { otp: string }) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "Your verification code",
    html: wrap("Your 2FA code", `Your code is <b style="font-size:20px">${otp}</b>. It expires in a few minutes.`),
  });
}

export async function sendOrganizationInvitation(args: {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: args.email,
    subject: `You're invited to ${args.teamName}`,
    html: wrap(
      `Join ${args.teamName}`,
      `${args.invitedByUsername} (${args.invitedByEmail}) invited you to join their organization.`,
      { url: args.inviteLink, label: "Accept invitation" }
    ),
  });
}
