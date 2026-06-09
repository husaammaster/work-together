FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Port: see ../PORTS.md (work-together backend = 5100, was 80).
ENV PORT=5100

EXPOSE 5100

CMD ["npm", "start"]