FROM node:22

COPY . /app
WORKDIR /app

#Install the dependencies
RUN npm install --ignore-scripts

ARG API_URI="http://localhost:8000"
ARG LLM_API_KEY= "AIzaSyC9nk-u0mzEzIKdj4ARECvAbjc2zKVUuNQ"
ENV REACT_APP_API_ENDPOINT=$API_URI
ENV REACT_APP_LLM_API_KEY=$LLM_API_KEY

#Create an optimized version of the webapp
RUN npm run build
RUN npm install serve

#Execute npm run prod to run the server
CMD [ "npm", "run", "prod" ]
#CMD ["npm", "start"]
