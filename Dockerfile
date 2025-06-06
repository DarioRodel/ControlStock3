FROM python:3.13.2

WORKDIR /

COPY ../../Desktop/a /
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN pip install --no-cache-dir -r requirements.txt

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 8005

ENTRYPOINT ["/entrypoint.sh"]

