# PASOS PARA DESPLEGAR EN VERCEL

## 📋 Preparación

1. **Instalar dependencias localmente (opcional para probar)**
   ```bash
   cd ~/Documents/google-ads-backend
   npm install
   ```

2. **Probar localmente (opcional)**
   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus credenciales
   npm run dev
   # Abrir http://localhost:3000
   ```

## 🚀 Deploy en Vercel

### Paso 1: Crear repositorio en GitHub

```bash
cd ~/Documents/google-ads-backend

# Inicializar git
git init
git add .
git commit -m "Initial commit - Google Ads Backend"

# Crear repo en GitHub
# Ve a https://github.com/new
# Nombre: google-ads-backend
# Público o Privado (tu elección)
# NO inicialices con README (ya lo tienes)

# Conectar y subir
git remote add origin https://github.com/TU_USUARIO/google-ads-backend.git
git branch -M main
git push -u origin main
```

### Paso 2: Deploy en Vercel

1. **Ve a [vercel.com](https://vercel.com)**

2. **Sign in con GitHub**

3. **Click "Add New Project"**

4. **Import el repositorio `google-ads-backend`**

5. **Configurar el proyecto:**
   - Framework Preset: `Next.js` (auto-detectado)
   - Root Directory: `./` (por defecto)
   - Build Command: `next build` (por defecto)
   - Output Directory: `.next` (por defecto)

6. **Agregar Environment Variables:**
   
   Click en "Environment Variables" y agrega:
   
   ```
   GOOGLE_ADS_DEVELOPER_TOKEN = tu_developer_token
   GOOGLE_ADS_CLIENT_ID = tu_client_id.apps.googleusercontent.com
   GOOGLE_ADS_CLIENT_SECRET = tu_client_secret
   GOOGLE_ADS_LOGIN_CUSTOMER_ID = tu_mcc_customer_id
   GOOGLE_ADS_REFRESH_TOKEN = tu_refresh_token
   API_SECRET_KEY = una_clave_larga_y_aleatoria  (la app la manda en X-API-Key)
   ```

7. **Click "Deploy"**

8. **Espera 1-2 minutos** mientras Vercel construye y despliega

9. **¡Listo!** Tu backend estará en:
   ```
   https://google-ads-backend-TU_USERNAME.vercel.app
   ```

## ✅ Verificar que funciona

```bash
# Probar health check
curl https://google-ads-backend-TU_USERNAME.vercel.app/api/health

# Deberías ver:
{
  "status": "ok",
  "service": "Google Ads Backend API",
  "configured": true,
  ...
}
```

## 📱 Actualizar App iOS

1. Abre `GoogleAdsAPIService.swift`

2. Busca la función `createResponsiveSearchAd`

3. Cambia la URL a tu backend:
   ```swift
   let backendURL = "https://google-ads-backend-TU_USERNAME.vercel.app/api/create-ad"
   ```

4. Ya puedes publicar anuncios! 🎉

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
cd ~/Documents/google-ads-backend
git add .
git commit -m "Descripción del cambio"
git push

# Vercel auto-desplegará los cambios en ~1 minuto
```

## 🐛 Troubleshooting

### Si el deploy falla:

1. **Revisa los logs en Vercel:**
   - Ve a tu proyecto en vercel.com
   - Click en el deployment fallido
   - Revisa "Build Logs"

2. **Verifica las variables de entorno:**
   - Settings → Environment Variables
   - Todas deben estar configuradas

3. **Re-deploy:**
   - Deployments → Click en los 3 puntos → "Redeploy"

### Si la API responde 500:

1. **Revisa los logs en tiempo real:**
   ```bash
   vercel logs --follow
   ```

2. **Verifica las credenciales** en las variables de entorno

## 🎯 Siguiente Paso

Una vez desplegado, actualiza tu app iOS con la nueva URL del backend y prueba crear un anuncio!
