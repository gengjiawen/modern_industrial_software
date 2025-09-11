FROM gitpod/workspace-full-vnc
RUN nvm i lts && npm i -g pnpm@9 npm npm-check-updates

