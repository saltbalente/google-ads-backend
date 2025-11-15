export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasCredentials = !!(
    process.env.GOOGLE_ADS_DEVELOPER_TOKEN &&
    process.env.GOOGLE_ADS_CLIENT_ID &&
    process.env.GOOGLE_ADS_CLIENT_SECRET &&
    process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID &&
    process.env.GOOGLE_ADS_REFRESH_TOKEN
  );

  return res.status(200).json({
    status: 'ok',
    service: 'Google Ads Backend API',
    version: '1.0.0',
    configured: hasCredentials,
    endpoints: {
      health: '/api/health',
      createAd: '/api/create-ad (POST)'
    },
    timestamp: new Date().toISOString()
  });
}
