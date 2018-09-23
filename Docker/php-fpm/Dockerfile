FROM php:7.1-fpm

RUN apt-get update && apt-get upgrade -y \
    && docker-php-ext-install \
    bz2 \
    iconv \
    mbstring \
    mysqli \
    pdo_mysql \
    mcrypt \
    zip \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl \
    && pecl install xdebug && docker-php-ext-enable xdebug \
    && apt-get autoremove -y --purge \
    && apt-get clean \
    && rm -Rf /tmp/*