FROM php:7.1-fpm

RUN curl -sS -o /tmp/icu.tar.gz -L http://download.icu-project.org/files/icu4c/57.1/icu4c-57_1-src.tgz && tar -zxf /tmp/icu.tar.gz -C /tmp && cd /tmp/icu/source && ./configure --prefix=/usr/local && make && make install

RUN apt-get update && apt-get upgrade -y \
    && apt-get install libbz2-dev libmcrypt-dev libreadline-dev zlib1g-dev libmosquitto-dev -y \
    && docker-php-ext-install \
    bz2 \
    iconv \
    mbstring \
    mysqli \
    pdo_mysql \
    mcrypt \
    zip \
    && docker-php-ext-configure intl --with-icu-dir=/usr/local \
    && docker-php-ext-install intl \
    && pecl install xdebug && docker-php-ext-enable xdebug \
    && pecl install  Mosquitto-alpha \
    && apt-get autoremove -y --purge \
    && echo "extension=mosquitto.so" > /usr/local/etc/php/conf.d/mosquitto.ini \
    && apt-get clean \
    && rm -Rf /tmp/*
