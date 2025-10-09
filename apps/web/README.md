This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Custom Domain Setup

This application is designed to work seamlessly with custom domains. Follow these steps to deploy with a custom domain like `russellroofing.com`.

### Prerequisites

- Vercel account with project deployed
- Domain purchased and DNS access available
- Understanding of SSL certificate requirements

### Step-by-Step Setup

#### 1. Add Domain in Vercel Dashboard

1. Go to your project in the Vercel dashboard
2. Navigate to **Settings** → **Domains**
3. Click **Add** and enter your custom domain (e.g., `russellroofing.com`)
4. Configure www redirect if needed:
   - Add both `russellroofing.com` and `www.russellroofing.com`
   - Set one as primary and the other to redirect

#### 2. Configure DNS Records

Update your domain's DNS settings with these records:

```bash
# A record for root domain
Type: A
Name: @
Value: 76.76.19.19
TTL: Auto or 3600

# CNAME record for www subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto or 3600

# Optional: CNAME for wildcard subdomains
Type: CNAME
Name: *
Value: cname.vercel-dns.com
TTL: Auto or 3600
```

#### 3. Verify Domain Ownership

1. After adding DNS records, return to Vercel dashboard
2. Click **Refresh** next to your domain
3. Wait for verification (may take up to 48 hours for DNS propagation)
4. Status should change from "Pending" to "Active"

#### 4. Test SSL Certificate

1. Visit your custom domain in a browser
2. Verify HTTPS is working (look for lock icon)
3. Check that HTTP redirects to HTTPS automatically
4. Verify SSL certificate is valid (issued by Let's Encrypt via Vercel)

#### 5. Update Environment Variables

Update your production environment variables:

```bash
# Custom Domain Configuration
CUSTOM_DOMAIN=russellroofing.com
NEXT_PUBLIC_SITE_URL=https://russellroofing.com
NEXT_PUBLIC_API_URL=https://russellroofing.com/api

# Security Configuration
SECURE_COOKIES=true

# Third-party Service Domain Configuration
HUBSPOT_WEBHOOK_BASE_URL=https://russellroofing.com
FACEBOOK_OAUTH_REDIRECT_URL=https://russellroofing.com/auth/callback
```

#### 6. Deploy and Verify Functionality

1. Deploy your application with updated environment variables
2. Test all major functionality:
   - Homepage loads correctly
   - API endpoints are accessible
   - Forms submit successfully
   - Third-party integrations work
   - All internal links function properly

### DNS Configuration Details

#### Required DNS Records

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| A | @ | 76.76.19.19 | Points root domain to Vercel |
| CNAME | www | cname.vercel-dns.com | Points www subdomain to Vercel |
| CNAME | * | cname.vercel-dns.com | Points all subdomains to Vercel (optional) |

#### Email Configuration (Optional)

If you need email with your domain, add MX records:

```bash
# Example MX records (adjust for your email provider)
Type: MX
Name: @
Value: mail.example.com
Priority: 10
```

### Troubleshooting

#### Common Issues

**DNS Propagation Delays**
- DNS changes can take 24-48 hours to propagate globally
- Use tools like `dig` or online DNS checkers to verify records
- Clear your browser cache and try incognito mode

**SSL Certificate Problems**
- Vercel automatically provisions Let's Encrypt certificates
- Certificates auto-renew every 60 days
- If SSL fails, check that DNS records are correct

**Domain Verification Failures**
- Ensure DNS records exactly match Vercel's requirements
- Check for conflicting DNS records
- Verify domain is not locked or has registrar restrictions

**Redirect Configuration**
- Set up proper redirects between www and non-www versions
- Ensure HTTPS redirects are working
- Test all redirect scenarios

#### Debug Commands

```bash
# Check DNS propagation
dig russellroofing.com
dig www.russellroofing.com

# Test SSL certificate
openssl s_client -connect russellroofing.com:443 -servername russellroofing.com

# Check HTTP headers
curl -I https://russellroofing.com
```

### Security Considerations

#### HTTPS Enforcement
- All traffic automatically redirects to HTTPS
- Strict Transport Security (HSTS) headers are enabled
- Security headers are configured in `next.config.mjs`

#### Content Security Policy
- CSP headers restrict resource loading
- Configured for third-party integrations (Google Maps, HubSpot, Instagram)
- Adjust CSP settings in security configuration if adding new services

### Third-Party Service Configuration

After setting up your custom domain, update these services:

#### HubSpot Integration
- Update webhook URLs in HubSpot app settings
- Configure OAuth redirect URLs
- Test form submissions and data synchronization

#### Instagram Integration
- Update Facebook App redirect URLs
- Configure production domain for OAuth
- Test media fetching functionality

#### Google Places Integration
- Configure API key domain restrictions
- Update referrer restrictions for production
- Test reviews and places functionality

### Monitoring and Maintenance

#### SSL Certificate Monitoring
- Certificates auto-renew, but monitor expiry dates
- Set up alerts for certificate renewal failures
- Verify HTTPS functionality after renewals

#### Performance Monitoring
- Monitor Core Web Vitals for custom domain
- Check loading times from different geographic locations
- Ensure CDN is working correctly with custom domain

#### Regular Health Checks
- Test all critical user journeys
- Verify API endpoints are accessible
- Check third-party integrations regularly
- Monitor for any hardcoded localhost references

### Support Resources

- [Vercel Custom Domains Documentation](https://vercel.com/docs/concepts/projects/custom-domains)
- [DNS Configuration Guide](https://vercel.com/docs/concepts/projects/custom-domains#dns-configuration)
- [SSL Certificates on Vercel](https://vercel.com/docs/concepts/projects/custom-domains#ssl-certificates)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
# Force rebuild to pick up environment variables
