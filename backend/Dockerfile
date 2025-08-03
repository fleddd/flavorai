FROM node:24.2.0-alpine

WORKDIR /app

RUN if [! -f package.json]; then npm init -y; fi

COPY package*.json ./
RUN npm install
RUN npm install -g tsx

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/main"]
