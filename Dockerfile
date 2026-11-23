FROM node:22-bookworm-slim AS client
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

FROM php:8.4-apache-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends unzip libstdc++6 \
    && rm -rf /var/lib/apt/lists/* && docker-php-ext-install pdo_mysql
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
COPY --from=client /usr/local/bin/node /usr/local/bin/node
WORKDIR /app/backend
COPY backend/ ./
RUN COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader \
    && chown -R www-data:www-data storage bootstrap/cache
COPY scripts/hosting/apache.conf /etc/apache2/sites-available/000-default.conf
RUN echo 'Listen 127.0.0.1:8000' > /etc/apache2/ports.conf
WORKDIR /app
COPY --from=client /app/node_modules ./node_modules
COPY --from=client /app/dist ./dist
COPY server ./server
COPY shared ./shared
COPY package.json tsconfig.json ./
COPY scripts/hosting/start.sh /usr/local/bin/start-game
RUN sed -i 's/\r$//' /usr/local/bin/start-game
ENV APP_ENV=production APP_DEBUG=false DB_CONNECTION=mysql SESSION_SECURE_COOKIE=true \
    LOG_CHANNEL=stderr NODE_ENV=production HOST=0.0.0.0 PORT=8080
CMD ["bash", "/usr/local/bin/start-game"]
