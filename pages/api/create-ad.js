import { GoogleAdsApi } from 'google-ads-api';
import { requireApiKey } from '../../lib/auth';

export default async function handler(req, res) {
  // Solo permitir POST. Sin CORS: la app iOS no lo necesita y así ninguna web
  // ajena puede llamar a este endpoint desde el navegador de un visitante.
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed. Use POST.' 
    });
  }

  // Este endpoint crea anuncios con las credenciales del MCC: nunca abierto.
  if (!requireApiKey(req, res)) return;

  try {
    const {
      customerId,
      adGroupId,
      headlines,
      descriptions,
      finalUrl
    } = req.body || {};

    console.log('📥 Request recibido para customer:', customerId);

    // Validaciones básicas
    if (!customerId || !adGroupId || !headlines || !descriptions || !finalUrl) {
      return res.status(400).json({ 
        success: false,
        error: 'Faltan campos requeridos',
        required: ['customerId', 'adGroupId', 'headlines', 'descriptions', 'finalUrl']
      });
    }

    // IDs numéricos y URL https: nada de rutas de recurso inyectadas.
    const cid = String(customerId).replace(/-/g, '');
    if (!/^\d{6,12}$/.test(cid) || !/^\d{1,20}$/.test(String(adGroupId))) {
      return res.status(400).json({ success: false, error: 'customerId o adGroupId inválido' });
    }
    try {
      if (new URL(finalUrl).protocol !== 'https:') throw new Error('protocolo');
    } catch {
      return res.status(400).json({ success: false, error: 'finalUrl debe ser una URL https válida' });
    }

    // Validar headlines
    if (!Array.isArray(headlines) || headlines.length < 3 || headlines.length > 15) {
      return res.status(400).json({ 
        success: false,
        error: 'Headlines debe ser un array de 3-15 elementos',
        received: headlines?.length || 0
      });
    }

    // Validar descripciones
    if (!Array.isArray(descriptions) || descriptions.length < 2 || descriptions.length > 4) {
      return res.status(400).json({ 
        success: false,
        error: 'Descriptions debe ser un array de 2-4 elementos',
        received: descriptions?.length || 0
      });
    }

    // Validar longitud de títulos
    for (let i = 0; i < headlines.length; i++) {
      if (typeof headlines[i] !== 'string' || headlines[i].length > 30) {
        return res.status(400).json({ 
          success: false,
          error: `Título ${i + 1} excede 30 caracteres`,
          title: headlines[i],
          length: headlines[i].length
        });
      }
    }

    // Validar longitud de descripciones
    for (let i = 0; i < descriptions.length; i++) {
      if (typeof descriptions[i] !== 'string' || descriptions[i].length > 90) {
        return res.status(400).json({ 
          success: false,
          error: `Descripción ${i + 1} excede 90 caracteres`,
          description: descriptions[i],
          length: descriptions[i].length
        });
      }
    }

    // Obtener credenciales del entorno
    const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
    const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;
    const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;

    if (!developerToken || !clientId || !clientSecret || !refreshToken) {
      console.error('❌ Faltan credenciales en el servidor');
      console.error('Developer Token:', developerToken ? '✓' : '✗');
      console.error('Client ID:', clientId ? '✓' : '✗');
      console.error('Client Secret:', clientSecret ? '✓' : '✗');
      console.error('Refresh Token:', refreshToken ? '✓' : '✗');
      console.error('Login Customer ID:', loginCustomerId ? '✓' : '✗');
      return res.status(500).json({ 
        success: false,
        error: 'Configuración del servidor incompleta',
        hint: 'Verifica que las variables de entorno estén configuradas en Vercel'
      });
    }

    console.log('🔧 Inicializando cliente Google Ads...');

    // Inicializar cliente Google Ads API
    const client = new GoogleAdsApi({
      client_id: clientId,
      client_secret: clientSecret,
      developer_token: developerToken
    });

    // Crear customer instance
    const customer = client.Customer({
      customer_id: cid,
      refresh_token: refreshToken,
      login_customer_id: loginCustomerId
    });

    console.log('📝 Preparando operación de creación...');

    // Construir operación usando el formato correcto de la librería
    const operation = {
      entity: 'ad_group_ad',
      operation: 'create',
      resource: {
        ad_group: `customers/${cid}/adGroups/${adGroupId}`,
        status: 'PAUSED',
        ad: {
          final_urls: [finalUrl],
          responsive_search_ad: {
            headlines: headlines.map(text => ({ text })),
            descriptions: descriptions.map(text => ({ text }))
          }
        }
      }
    };

    console.log('🚀 Enviando request a Google Ads API...');
    console.log(`📊 Customer: ${customerId}, Ad Group: ${adGroupId}`);
    console.log(`📊 Títulos: ${headlines.length}, Descripciones: ${descriptions.length}`);

    // Usar el método mutate del servicio adGroupAds
    const response = await customer.adGroupAds.create([operation.resource]);


    // Extraer resource name
    const resourceName = response?.results?.[0]?.resource_name || 
                         response?.[0]?.resource_name || 
                         'unknown';

    console.log('✅ Anuncio creado exitosamente:', resourceName);

    return res.status(200).json({
      success: true,
      resourceName: resourceName,
      message: 'Anuncio creado exitosamente en Google Ads (pausado para revisión)',
      details: {
        customerId,
        adGroupId,
        headlinesCount: headlines.length,
        descriptionsCount: descriptions.length,
        status: 'PAUSED'
      }
    });

  } catch (error) {
    console.error('❌ Error creando anuncio:', error);

    // Extraer información útil del error
    let errorMessage = error.message || 'Error desconocido';

    // Si es un error de Google Ads API
    if (error.errors) {
      errorMessage = error.errors.map(e => e.message).join(', ');
    }

    // El detalle (error.errors, stack) queda en los logs del servidor; al
    // cliente solo el mensaje de Google Ads, sin tipo interno ni stack.
    return res.status(500).json({
      success: false,
      error: errorMessage,
      hint: 'Verifica que las credenciales sean correctas y que la cuenta tenga permisos'
    });
  }
}
