FROM node:10-alpine
# hadolint ignore=DL3018
RUN apk --no-cache add bash curl less vim tini
SHELL ["/bin/bash", "-o", "pipefail", "-o", "errexit", "-u", "-c"]
WORKDIR /usr/local/src/reaction-app
# allow yarn to created ./node_modules
RUN chown node:node .
USER node
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts --non-interactive --no-cache
COPY --chown=node:node . ./
# TODO next seems to do extra compiling/building at startup, which requires
# dev dependencies. Is there a way to get a true production build?
RUN NODE_ENV=production IS_BUILDING_NEXTJS=1 "$(npm bin)/next" build src
ENV PATH=$PATH:/usr/local/src/reaction-app/node_modules/.bin
ENTRYPOINT ["tini", "--", "node", "."]
LABEL com.reactioncommerce.name="example-storefront"
