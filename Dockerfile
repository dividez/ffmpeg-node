FROM node:current

VOLUME ["/root"]

RUN apt-get update \
    && apt-get -y install software-properties-common \
    && add-apt-repository ppa:jonathonf/ffmpeg-4 \
    && apt-get -y install ffmpeg \
    && ffmpeg -version \

RUN apt-get clean \
    && apt-get autoclean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && rm /var/log/lastlog /var/log/faillog

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production
# Bundle app source
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]