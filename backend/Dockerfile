FROM node:20-bookworm

ENV RELEASE="testnet-v1.21.0"
ENV RELEASE_ARCHIVE="sui-testnet-v1.21.0-ubuntu-x86_64.tgz"
ENV WORK_DIR="/contracts"
ENV HOME="/home/s3"

# for contracts we create
VOLUME $WORK_DIR
# for dependencies
VOLUME $HOME/.move

RUN mkdir -p $HOME/app/node_modules $HOME/.move $WORK_DIR && chown -R node:node $HOME $WORK_DIR
WORKDIR $HOME/app
COPY --chown=node:node backend/ ./

RUN npm install -g pnpm && scripts/install-sui.sh

USER node
RUN pnpm install && pnpm run build && sh scripts/install-deps.sh
COPY --chown=node:node . .

ENV PORT=3000
EXPOSE 3000/tcp

ENV NODE_ENV="production"

CMD ["pnpm", "start"]
