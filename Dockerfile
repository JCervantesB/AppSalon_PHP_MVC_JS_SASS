FROM mcr.microsoft.com/vscode/devcontainers/php:0-8.2

# Install system dependencies
RUN apt-get update && apt-get upgrade -y

# Install MySQL extension
RUN docker-php-ext-install mysqli pdo_mysql && docker-php-ext-enable mysqli
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
