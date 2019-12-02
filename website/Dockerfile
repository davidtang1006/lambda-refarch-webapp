FROM node:11.15.0 

WORKDIR /usr/src/app
COPY package.json .
COPY bower.json .
COPY gulpfile.js .
COPY ./gulp /usr/src/app/gulp
RUN npm install -g gulp
RUN npm install -g bower
RUN npm install
RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN bower install  
RUN gulp build
COPY . .

CMD [ "gulp", "serve:dist" ]    
