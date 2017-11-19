FROM    node:8.9.1 AS build
ENV     CALYPSO_ENV=wpcalypso \
        NODE_ENV=wpcalypso    \
        NODE_PATH=/calypso/server:/calypso/client
WORKDIR /calypso
COPY    ./env-config.sh /tmp/env-config.sh
RUN     chmod u+x /tmp/env-config.sh && /tmp/env-config.sh && rm /tmp/env-config.sh
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
COPY    ./docs     ./docs
COPY    ./assets   ./assets
COPY    ./public   ./public
COPY    ./server   ./server
COPY    ./config   ./config
COPY    ./client   ./client
RUN     CALYPSO_ENV=production npm run build



FROM    node:8.9.1 AS filter
COPY    --from=build /calypso/config       /calypso/config
COPY    --from=build /calypso/node_modules /calypso/node_modules
COPY    --from=build /calypso/server       /calypso/server
COPY    --from=build /calypso/build        /calypso/build
COPY    --from=build /calypso/public       /calypso/public
RUN     chown -R nobody /calypso



FROM    node:8.9.1-alpine
LABEL   maintainer="Automattic"
ENV     CALYPSO_ENV=wpcalypso \
        NODE_ENV=wpcalypso    \
        NODE_PATH=/calypso/server
WORKDIR /calypso
COPY    ./env-config.sh /tmp/env-config.sh
RUN     chmod u+x /tmp/env-config.sh && /tmp/env-config.sh && rm /tmp/env-config.sh
COPY    --from=filter /calypso /calypso
USER    nobody
RUN     export NODE_ENV=production
CMD     ["node", "build/bundle.js" ]
