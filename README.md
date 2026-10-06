# Google Ads Backend API 🚀

Backend intermedio para comunicarse con Google Ads API usando gRPC. Soluciona el problema del error 501 UNIMPLEMENTED en la API REST.

## 🎯 Problema que Resuelve

Google Ads REST API tiene limitaciones:
- ✅ `:search` funciona (lecturas)
- ❌ `:mutate` NO funciona via REST (solo gRPC)

Este backend usa la librería oficial `google-ads-api` que maneja gRPC internamente.

## 🏗️ Arquitectura

```
App iOS → Backend (Next.js/Vercel) → Google Ads API (gRPC) → Google Ads
```

## 📦 Instalación Local

```bash
# Clonar e instalar
cd google-ads-backend
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Correr en desarrollo
npm run dev

# El servidor estará en http://localhost:3000
```

## 🌐 Endpoints

### 1. Health Check
```bash
GET /api/health
```

Respuesta:
```json
{
  "status": "ok",
  "service": "Google Ads Backend API",
  "configured": true,
  "endpoints": {
    "health": "/api/health",
    "createAd": "/api/create-ad (POST)"
  }
}
```

### 2. Crear Anuncio
```bash
POST /api/create-ad
Content-Type: application/json
X-API-Key: <API_SECRET_KEY>
```

Sin la cabecera `X-API-Key` correcta responde `401`; si `API_SECRET_KEY` no
está configurada en el servidor, responde `503` (nunca queda abierto).

Body:
```json
{
  "customerId": "1234567890",
  "adGroupId": "9876543210",
  "headlines": [
    "Título 1",
    "Título 2",
    "..."
  ],
  "descriptions": [
    "Descripción 1",
    "Descripción 2",
    "Descripción 3",
    "Descripción 4"
  ],
  "finalUrl": "https://example.com"
}
```

Respuesta exitosa:
```json
{
  "success": true,
  "resourceName": "customers/1234567890/adGroupAds/9876543210~123456789",
  "message": "Anuncio creado exitosamente en Google Ads",
  "details": {
    "customerId": "1234567890",
    "adGroupId": "9876543210",
    "headlinesCount": 15,
    "descriptionsCount": 4
  }
}
```

## 🔐 Variables de Entorno

Configura estas variables en Vercel (o `.env.local` para desarrollo):

```env
GOOGLE_ADS_DEVELOPER_TOKEN=tu_developer_token
GOOGLE_ADS_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=tu_client_secret
GOOGLE_ADS_LOGIN_CUSTOMER_ID=tu_mcc_customer_id
GOOGLE_ADS_REFRESH_TOKEN=tu_refresh_token
API_SECRET_KEY=una_clave_larga_y_aleatoria
```

## 🚀 Deploy en Vercel

### Opción 1: Desde GitHub (Recomendado)

```bash
# 1. Inicializar Git
git init
git add .
git commit -m "Initial commit - Google Ads Backend"

# 2. Crear repo en GitHub
# Ve a github.com y crea un nuevo repositorio

# 3. Subir código
git remote add origin https://github.com/TU_USUARIO/google-ads-backend.git
git branch -M main
git push -u origin main

# 4. Deploy en Vercel
# - Ve a vercel.com
# - Click "Add New Project"
# - Import tu repositorio de GitHub
# - Configura las variables de entorno
# - Click "Deploy"
```

### Opción 2: Deploy directo con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir las instrucciones
# Configurar variables de entorno en el dashboard
```

## 📱 Integración con App iOS

Actualiza `GoogleAdsAPIService.swift`:

```swift
func createResponsiveSearchAd(
    customerId: String,
    adGroupId: String,
    headlines: [String],
    descriptions: [String],
    finalUrl: String
) async throws -> String {
    
    // URL de tu backend en Vercel
    let backendURL = "https://tu-proyecto.vercel.app/api/create-ad"
    
    guard let url = URL(string: backendURL) else {
        throw GoogleAdsAPIError.invalidResponse
    }
    
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.setValue(apiSecretKey, forHTTPHeaderField: "X-API-Key") // desde el Keychain
    
    let payload: [String: Any] = [
        "customerId": customerId,
        "adGroupId": adGroupId,
        "headlines": headlines,
        "descriptions": descriptions,
        "finalUrl": finalUrl
    ]
    
    request.httpBody = try JSONSerialization.data(withJSONObject: payload)
    
    let (data, response) = try await URLSession.shared.data(for: request)
    
    guard let httpResponse = response as? HTTPURLResponse else {
        throw GoogleAdsAPIError.invalidResponse
    }
    
    if httpResponse.statusCode != 200 {
        let errorString = String(data: data, encoding: .utf8) ?? "Error desconocido"
        print("❌ Error: \(errorString)")
        throw GoogleAdsAPIError.mutationFailed(errorString)
    }
    
    if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
       let resourceName = json["resourceName"] as? String {
        print("✅ Anuncio creado: \(resourceName)")
        return resourceName
    }
    
    throw GoogleAdsAPIError.invalidResponse
}
```

## 📊 Validaciones

El backend valida automáticamente:

- ✅ Headlines: 3-15 elementos, máx 30 caracteres c/u
- ✅ Descriptions: 2-4 elementos, máx 90 caracteres c/u
- ✅ URL válida
- ✅ Todos los campos requeridos

## 🔍 Logs y Debugging

Vercel proporciona logs en tiempo real:

```bash
# Ver logs en tiempo real
vercel logs

# O desde el dashboard: vercel.com/tu-proyecto/logs
```

## 💰 Costos

**Vercel Free Tier:**
- ✅ 100 GB bandwidth/mes
- ✅ 100 requests/segundo
- ✅ Deploy ilimitados
- ✅ HTTPS incluido

Para tu caso de uso: **COMPLETAMENTE GRATIS**

## 🛠️ Troubleshooting

### Error: "Configuración del servidor incompleta"
- Verifica que todas las variables de entorno estén configuradas en Vercel

### Error: "Authentication failed"
- Verifica que el refresh token sea válido
- Regenera el refresh token si es necesario

### Error: "Permission denied"
- Verifica que la cuenta tenga permisos para crear anuncios
- Verifica el login_customer_id

## 📚 Recursos

- [Google Ads API Docs](https://developers.google.com/google-ads/api/docs/start)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)

## 🤝 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel
2. Prueba el endpoint `/api/health`
3. Verifica las credenciales

---

**Hecho con ❤️ para solucionar el error 501 de Google Ads API**
