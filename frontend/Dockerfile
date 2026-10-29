FROM nginx:alpine

# Aplica los parches de seguridad del sistema base (corrige CVEs detectados por Trivy)
RUN apk upgrade --no-cache

# Limpia contenido por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copia los archivos del frontend
COPY index.html app.js /usr/share/nginx/html/

# Copia la configuración custom de Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Permite a Docker saber si nginx está sirviendo correctamente
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ > /dev/null || exit 1