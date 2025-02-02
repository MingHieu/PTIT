docker load < ./vinaedu-server.tar && \
docker load < ./face-recognition.tar && \
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d