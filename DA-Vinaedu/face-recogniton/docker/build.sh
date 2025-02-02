docker build --no-cache --platform linux/amd64 -t face-recognition . && \
docker save -o face-recognition.tar face-recognition