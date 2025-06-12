export const verificationCodeEmail = (verificationLink: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      	<title>Verify Your Email - TestGenie</title>
      <style>
          /* Reset styles */
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }

          body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
              padding: 20px;
              line-height: 1.6;
          }

          .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 16px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              border: 1px solid rgba(0, 0, 0, 0.05);
              overflow: hidden;
          }

          .header {
              background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
              padding: 32px 40px;
              text-align: center;
              position: relative;
          }

          .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
              pointer-events: none;
          }

          .logo {
              width: 48px;
              height: 48px;
              background: linear-gradient(135deg, #0a0a0a 0%, #404040 100%);
              border-radius: 12px;
              margin: 0 auto 16px;
              position: relative;
              z-index: 1;
          }

          .brand-name {
              color: #ffffff;
              font-size: 24px;
              font-weight: 600;
              letter-spacing: -0.025em;
              position: relative;
              z-index: 1;
          }

          .content {
              padding: 40px;
              text-align: center;
          }

          .welcome-text {
              font-size: 28px;
              font-weight: 300;
              color: #0a0a0a;
              margin-bottom: 8px;
              letter-spacing: -0.015em;
          }

          .gradient-text {
              background: linear-gradient(135deg, #0a0a0a 0%, #404040 100%);
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              font-weight: 500;
          }

          .description {
              color: #6b7280;
              font-size: 16px;
              font-weight: 300;
              margin-bottom: 32px;
              line-height: 1.5;
          }

          .otp-container {
              background: linear-gradient(135deg, rgba(245, 245, 245, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%);
              border: 1px solid rgba(0, 0, 0, 0.05);
              border-radius: 16px;
              padding: 32px;
              margin-bottom: 32px;
              backdrop-filter: blur(8px);
          }

          .otp-label {
              font-size: 14px;
              font-weight: 500;
              color: #0a0a0a;
              margin-bottom: 16px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
          }

          .otp-code {
              font-size: 36px;
              font-weight: 700;
              color: #0a0a0a;
              letter-spacing: 8px;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              background: linear-gradient(135deg, #0a0a0a 0%, #404040 100%);
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 16px;
          }

          .otp-instructions {
              font-size: 13px;
              color: #6b7280;
              font-weight: 300;
          }

          .security-notice {
              background: linear-gradient(135deg, rgba(245, 245, 245, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%);
              border: 1px solid rgba(0, 0, 0, 0.05);
              border-radius: 12px;
              padding: 24px;
              margin-bottom: 32px;
              backdrop-filter: blur(8px);
          }

          .security-title {
              font-size: 14px;
              font-weight: 500;
              color: #0a0a0a;
              margin-bottom: 8px;
          }

          .security-text {
              font-size: 13px;
              color: #6b7280;
              font-weight: 300;
          }

          .footer {
              background: linear-gradient(135deg, rgba(245, 245, 245, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%);
              border-top: 1px solid rgba(0, 0, 0, 0.05);
              padding: 24px 40px;
              text-align: center;
          }

          .footer-text {
              color: #6b7280;
              font-size: 12px;
              font-weight: 300;
              margin-bottom: 8px;
          }

          .footer-link {
              color: #0a0a0a;
              text-decoration: none;
              font-weight: 400;
          }

          .footer-link:hover {
              text-decoration: underline;
          }

          /* Responsive */
          @media (max-width: 600px) {
              .email-container {
                  margin: 10px;
                  border-radius: 12px;
              }

              .header {
                  padding: 24px 20px;
              }

              .content {
                  padding: 24px 20px;
              }

              .footer {
                  padding: 20px;
              }

              .welcome-text {
                  font-size: 24px;
              }

              .otp-code {
                  font-size: 28px;
                  letter-spacing: 6px;
              }

              .otp-container {
                  padding: 24px;
              }
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <!-- Header -->
          <div class="header">
              <div class="logo"></div>
                                      <div class="brand-name">TestGenie</div>
          </div>

          <!-- Main Content -->
          <div class="content">
              <h1 class="welcome-text">
                                      Welcome to <span class="gradient-text">TestGenie</span>
              </h1>

              <p class="description">
                  You're one step away from crafting your perfect day with AI-powered precision.
                  Please enter the verification code below to activate your account.
              </p>

              <div class="otp-container">
                  <div class="otp-label">Verify Your Account</div>
                  <a href="${verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #0a0a0a 0%, #404040 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 500; margin: 16px 0; transition: all 0.2s ease;">
                      Verify My Email
                  </a>
                  <div class="otp-instructions">
                      Click the button above to verify your email address
                  </div>
              </div>

              <div class="security-notice">
                  <div class="security-title">🔒 Security Notice</div>
                  <div class="security-text">
                      This verification link will expire in 10 minutes. If you didn't create an account with TestGenie,
                      you can safely ignore this email. Never share this link with anyone.
                  </div>
              </div>

              <div style="margin-top: 24px; font-size: 13px; color: #6b7280;">
                  If the button doesn't work, copy and paste this link into your browser:
                  <div style="margin-top: 8px; word-break: break-all; background-color: #f5f5f5; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 12px;">
                      ${verificationLink}
                  </div>
              </div>
          </div>

          <!-- Footer -->
          <div class="footer">
              <p class="footer-text">
                  © 2025 TestGenie. All rights reserved.
              </p>
              <p class="footer-text">
                  <a href="#" class="footer-link">Privacy Policy</a> •
                  <a href="#" class="footer-link">Terms of Service</a> •
                  <a href="#" class="footer-link">Support</a>
              </p>
          </div>
      </div>
  </body>
  </html>

`;
