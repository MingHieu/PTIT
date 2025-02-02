FROM tensorflow/tensorflow:2.16.2

WORKDIR /usr/src/app

COPY src src

COPY app.py app.py

COPY requirements.txt requirements.txt

RUN pip install --no-cache-dir --ignore-installed -r requirements.txt