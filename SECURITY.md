# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within Cold Dialer, please send an email to security@example.com. All security vulnerabilities will be promptly addressed.

## Security Best Practices

When deploying Cold Dialer:

1. **Change default secrets**: Update `JWT_SECRET` in production
2. **Use HTTPS**: Always deploy behind HTTPS
3. **Secure SIP credentials**: Never commit SIP passwords to version control
4. **Database security**: Use file permissions to restrict database access
5. **Network security**: Consider firewall rules for SIP/WebSocket traffic

## Environment Variables

Never commit these files:
- `.env.local` (contains real credentials)
- `.env.production`

Use `.env.example` as a template.

## Authentication

- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt
- Auth middleware validates all API requests

## SIP Security

- SIP credentials are stored in environment variables
- WebSocket connections use WSS (encrypted)
- P-Asserted-Identity headers are used for caller ID
