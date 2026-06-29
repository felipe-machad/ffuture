FROM nginx:alpine

# Configuração mínima do nginx (gzip + cache de assets estáticos)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o site estático para o diretório servido pelo nginx
COPY . /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
