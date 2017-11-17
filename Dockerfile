FROM    node:8.9.1 AS build
WORKDIR /calypso
COPY    ./env-config.sh /tmp/env-config.sh
COPY    ./assets   ./assets
COPY    ./bin      ./bin
COPY    ./client   ./client
COPY    ./config   ./config
COPY    ./docs     ./docs
COPY    ./public   ./public
COPY    ./server   ./server
COPY    ./.babelrc               \
        ./.npmrc                 \
        ./.nvmrc                 \
        ./.rtlcssrc              \
        ./index.js               \
        ./jsconfig.json          \
        ./npm-shrinkwrap.json    \
        ./package.json           \
        ./postcss.config.json    \
        ./webpack.config.js      \
        ./webpack.config.node.js \
        ./
ENV     CALYPSO_ENV=production \
        NODE_ENV=production \
        NODE_PATH=/calypso/server:/calypso/client
RUN     npm install --prod && touch node_modules && npm run build
# RUN     npm run build-devdocs:components-usage-stats
# RUN     npm run build-devdocs:components-usage-stats:_env
# RUN     npm run build-devdocs:index
# RUN     npm run build-devdocs:index:_env
# RUN     npm run build-server
# RUN     npm run build-client-if-prod
# RUN     npm run build-client-if-desktop
# RUN     npm run build-css
# RUN     npm run build



FROM    node:8.9.1 AS filter
COPY    --from=build /calypso/node_modules /calypso/node_modules
COPY    --from=build /calypso/build        /calypso/build
COPY    --from=build /calypso/public       /calypso/public
RUN     chown -R nobody /calypso



FROM    node:8.9.1-alpine
LABEL   maintainer="Automattic"
WORKDIR /calypso
COPY    ./env-config.sh /tmp/env-config.sh
ENV     CALYPSO_ENV=production \
        NODE_ENV=production
COPY    --from=filter /calypso /calypso
# USER    nobody
CMD     [ "node", "build/bundle.js" ]
