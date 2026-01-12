# 🔍 Business Finder - Buscador de Negocios

Aplicación web desarrollada en React que permite buscar negocios locales utilizando Google Places API y contactarlos directamente por WhatsApp.

## ✨ Características

- 🔎 **Búsqueda Inteligente**: Encuentra negocios por nombre y ciudad
- 📱 **Integración WhatsApp**: Contacta directamente con los negocios
- 🗺️ **Google Maps**: Abre la ubicación en Google Maps
- ⭐ **Ratings y Reseñas**: Visualiza las calificaciones de los negocios
- 🎨 **Diseño Moderno**: Interfaz atractiva con animaciones suaves
- 📱 **Responsive**: Funciona perfectamente en móviles, tablets y desktop

## 🚀 Tecnologías

- **React 18** - Framework de interfaz
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework de CSS
- **Google Places API (Nueva)** - Búsqueda de negocios
- **Axios** - Cliente HTTP

## 📋 Requisitos Previos

Antes de comenzar, necesitas:

1. **Node.js** (versión 18 o superior)
2. **API Key de Google Cloud Platform** con acceso a Places API

### Obtener API Key de Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Places API (New)**
4. Crea credenciales (API Key)
5. Configura restricciones según tus necesidades

> ⚠️ **Nota de Facturación**: La Google Places API tiene costos después de las búsquedas gratuitas mensuales. Revisa la [documentación de precios](https://mapsplatform.google.com/pricing/).

## 🛠️ Instalación

1. **Clonar o navegar al directorio del proyecto**

```bash
cd business-finder
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` y agrega tu API key:

```env
VITE_GOOGLE_PLACES_API_KEY=tu_api_key_aqui
```

4. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📖 Uso

1. **Buscar Negocios**
   - Ingresa el tipo de negocio (ej: "Restaurante", "Peluquería", "Ferretería")
   - Ingresa la ciudad donde deseas buscar
   - Haz clic en "Buscar Negocios"

2. **Contactar por WhatsApp**
   - En los resultados, haz clic en el botón "WhatsApp" de cualquier negocio
   - Se abrirá WhatsApp Web/App con un mensaje predeterminado

3. **Ver en Google Maps**
   - Haz clic en "Ver en Maps" para abrir la ubicación del negocio

## 📁 Estructura del Proyecto

```
business-finder/
├── src/
│   ├── components/         # Componentes React
│   │   ├── SearchBar.jsx   # Barra de búsqueda
│   │   ├── BusinessCard.jsx # Tarjeta de negocio
│   │   └── ResultsList.jsx  # Lista de resultados
│   ├── services/           # Servicios de API
│   │   └── placesService.js # Integración con Google Places
│   ├── utils/              # Utilidades
│   │   └── whatsapp.js     # Funciones de WhatsApp
│   ├── config/             # Configuración
│   │   └── api.js          # Config de API
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── index.html              # HTML principal
├── package.json            # Dependencias
├── vite.config.js          # Configuración de Vite
├── tailwind.config.js      # Configuración de Tailwind
└── .env.example            # Plantilla de variables de entorno
```

## 🎨 Componentes

### SearchBar
Componente de búsqueda con validación de formulario:
- Validación de campos requeridos
- Estados de carga
- Mensajes de error personalizados

### BusinessCard
Tarjeta individual de negocio con:
- Imagen del negocio
- Nombre y dirección
- Rating con estrellas
- Botones de WhatsApp y Google Maps

### ResultsList
Contenedor de resultados con:
- Grid responsivo
- Estados de carga, error y vacío
- Contador de resultados

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

## 🌐 Despliegue

Para desplegar en producción:

1. **Build del proyecto**
```bash
npm run build
```

2. **Desplegar en tu hosting favorito**
   - Vercel
   - Netlify
   - Firebase Hosting
   - Etc.

> 📝 **Importante**: No olvides configurar las variables de entorno en tu plataforma de hosting.

## ⚠️ Limitaciones

- Los negocios deben tener su número de teléfono público en Google Maps para que aparezca el botón de WhatsApp
- La API de Google Places tiene límites de uso y costos asociados
- Se requiere conexión a internet

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ para facilitar la conexión con negocios locales.

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la [documentación de Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview)
2. Verifica que tu API key esté correctamente configurada
3. Asegúrate de tener la Places API habilitada en Google Cloud Console

---

**¡Comienza a conectar con negocios locales hoy! 🚀**
