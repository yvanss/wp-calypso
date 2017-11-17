#
# Dependencies step
#
FROM  node:8.9.1 AS install
COPY  ./env-config.sh /tmp/env-config.sh
COPY  ./npm-shrinkwrap.json \
      ./package.json        \
      ./
RUN   npm install --production


#
# Build step
#
FROM    node:8.9.1 AS build
WORKDIR /calypso
COPY    ./env-config.sh /tmp/env-config.sh
COPY    --from=install ./node_modules ./node_modules
COPY    --from=install        \
        ./npm-shrinkwrap.json \
        ./package.json        \
        ./
COPY    ./assets   ./assets
COPY    ./bin      ./bin
COPY    ./client   ./client
COPY    ./config   ./config
COPY    ./docs     ./docs
COPY    ./public   ./public
COPY    ./server   ./server
COPY    ./.babelrc               \
        ./.nvmrc                 \
        ./.rtlcssrc              \
        ./postcss.config.json    \
        ./index.js               \
        ./jsconfig.json          \
        ./webpack.config.js      \
        ./webpack.config.node.js \
        ./
ENV     CALYPSO_ENV=production \
        NODE_ENV=production \
        NODE_PATH=/calypso/server:/calypso/client
#RUN     npm run build
RUN     npm run build-devdocs:components-usage-stats
RUN     npm run build-devdocs:components-usage-stats:_env
RUN     npm run build-devdocs:index
RUN     npm run build-devdocs:index:_env
RUN     npm run build-server
RUN     npm run build-client-if-prod
RUN     npm run build-client-if-desktop
RUN     npm run build-css
RUN     chown -R nobody build


#
# Build application image
#
FROM    node:8.9.1
LABEL   maintainer="Automattic"
WORKDIR /calypso
COPY    ./env-config.sh /tmp/env-config.sh
ENV     CALYPSO_ENV=production \
        NODE_ENV=production
COPY    --from=build /calypso/build ./build
RUN     ls -la .
RUN     ls -la build
USER    nobody
CMD     [ "node", "build/bundle.js" ]
