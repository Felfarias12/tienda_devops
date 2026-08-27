FROM nginx:alpine

# Limpia contenido por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copia los archivos del frontend
COPY index.html app.js /usr/share/nginx/html/

# Copia la configuración custom de Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80