FROM node:14
RUN apt-get update
RUN apt-get install -y \
	build-essential \
	zlib1g-dev \
	libncurses5-dev \
	libgdbm-dev \
	libnss3-dev \
	libssl-dev \
	libreadline-dev \
	libffi-dev \
	libsqlite3-dev \
	wget \
	libbz2-dev
RUN wget https://www.python.org/ftp/python/3.8.0/Python-3.8.0.tgz
RUN tar -xf Python-3.8.0.tgz
RUN cd Python-3.8.0 && \
	./configure --enable-optimizations && \
	make -j 8 && \
	make altinstall
RUN python3.8 -m pip install --upgrade pip && \
	pip3.8 install --no-cache tensorflow && \
	pip3.8 install pillow && \
	pip3.8 install requests && \
	pip3.8 install bs4 && \
	pip3.8 install googletrans && \
	pip3.8 install nltk && \
	nltk.download('punkt') && \
	nltk.download('wordnet') && \
	nltk.download('omw-1.4')

WORKDIR /khambenh-app
COPY package.json .
RUN npm install
COPY . .
CMD npm start
