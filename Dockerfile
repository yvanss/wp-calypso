FROM    node:8.9.1 AS build
ENV     CALYPSO_ENV=wpcalypso \
        NODE_ENV=wpcalypso    \
        NODE_PATH=/calypso/server:/calypso/client
WORKDIR /calypso
COPY    ./env-config.sh /tmp/env-config.sh
COPY    ./npm-shrinkwrap.json    \
        ./package.json           \
        ./
RUN     npm install --prod && touch node_modules
COPY    ./.babelrc               \
        ./.npmrc                 \
        ./.nvmrc                 \
        ./.rtlcssrc              \
        ./index.js               \
        ./jsconfig.json          \
        ./postcss.config.json    \
        ./webpack.config.js      \
        ./webpack.config.node.js \
        ./
COPY    ./bin      ./bin
COPY    ./assets   ./assets
COPY    ./public   ./public
COPY    ./server   ./server
COPY    ./config   ./config
COPY    ./client   ./client
RUN     npm run build
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
COPY    --from=build /calypso/config       /calypso/config
COPY    --from=build /calypso/node_modules /calypso/node_modules
COPY    --from=build /calypso/build        /calypso/build
COPY    --from=build /calypso/public       /calypso/public
COPY    --from=build /calypso/server       /calypso/server
RUN     chown -R nobody /calypso



FROM    node:8.9.1-alpine
LABEL   maintainer="Automattic"
ENV     CALYPSO_ENV=wpcalypso \
        NODE_ENV=wpcalypso    \
        NODE_PATH=/calypso/server:/calypso/client
WORKDIR /calypso
COPY    ./env-config.sh /tmp/env-config.sh
COPY    --from=filter /calypso /calypso
# USER    nobody
CMD     ["node", "build/bundle.js" ]
