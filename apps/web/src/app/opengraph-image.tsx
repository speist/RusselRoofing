import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Russell Roofing & Exteriors - Professional Roofing and Exterior Services'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#960120',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #960120 0%, #6b0117 50%, #960120 100%)',
            opacity: 1,
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            padding: '40px',
          }}
        >
          {/* Logo Text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '-2px',
                textAlign: 'center',
                lineHeight: 1.1,
              }}
            >
              Russell Roofing
            </div>
            <div
              style={{
                fontSize: '36px',
                fontWeight: '500',
                color: 'white',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                marginTop: '8px',
              }}
            >
              & Exteriors
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '28px',
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.4,
              marginBottom: '30px',
            }}
          >
            Professional Roofing, Siding, Windows & Exterior Services
          </div>

          {/* Service Areas */}
          <div
            style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
            }}
          >
            Serving Greater Philadelphia, South Jersey & Surrounding Counties Since 1992
          </div>

          {/* Services Bar */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '40px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {['Roofing', 'Siding', 'Windows', 'Skylights', 'Masonry'].map((service) => (
              <div
                key={service}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  padding: '10px 24px',
                  borderRadius: '25px',
                  fontSize: '18px',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                {service}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '18px',
          }}
        >
          <span>1-888-567-7663</span>
          <span>|</span>
          <span>info@russellroofing.com</span>
          <span>|</span>
          <span>Free Estimates</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
