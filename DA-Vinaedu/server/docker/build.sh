docker build --no-cache --platform linux/amd64 -t vinaedu-server . && \
docker save -o vinaedu-server.tar vinaedu-server