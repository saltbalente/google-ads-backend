export default function Home() {
  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '50px auto',
      padding: '20px'
    }}>
      <h1>🎯 Google Ads Backend API</h1>
      <p>Backend activo para creación de anuncios en Google Ads vía gRPC.</p>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>📡 Endpoints Disponibles</h2>
        
        <h3>1. Health Check</h3>
        <pre style={{ background: '#fff', padding: '10px', borderRadius: '4px' }}>
GET /api/health
        </pre>
        
        <h3>2. Crear Anuncio</h3>
        <pre style={{ background: '#fff', padding: '10px', borderRadius: '4px' }}>
POST /api/create-ad
Content-Type: application/json
X-API-Key: (API_SECRET_KEY)

{'{'}
  "customerId": "1234567890",
  "adGroupId": "9876543210",
  "headlines": ["Título 1", "Título 2", ... hasta 15],
  "descriptions": ["Desc 1", "Desc 2", "Desc 3", "Desc 4"],
  "finalUrl": "https://example.com"
{'}'}
        </pre>
      </div>

      <div style={{ 
        background: '#e3f2fd', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>📋 Requisitos</h2>
        <ul>
          <li>✅ Headlines: 3-15 títulos (máx 30 caracteres cada uno)</li>
          <li>✅ Descriptions: 2-4 descripciones (máx 90 caracteres cada una)</li>
          <li>✅ Final URL válida</li>
          <li>✅ Cabecera X-API-Key</li>
        </ul>
      </div>

      <div style={{ 
        background: '#fff3e0', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>⚙️ Configuración</h2>
        <p>Asegúrate de configurar estas variables de entorno en Vercel:</p>
        <ul>
          <li><code>GOOGLE_ADS_DEVELOPER_TOKEN</code></li>
          <li><code>GOOGLE_ADS_CLIENT_ID</code></li>
          <li><code>GOOGLE_ADS_CLIENT_SECRET</code></li>
          <li><code>GOOGLE_ADS_LOGIN_CUSTOMER_ID</code></li>
        </ul>
      </div>

      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#666' }}>
        <p>🚀 Powered by Next.js + Google Ads API v16</p>
      </footer>
    </div>
  );
}
