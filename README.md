# Project 1 - API

First project's API for the frontend's SPA (developed in Angular) to be able to create, read, update and deleleta data (basic CRUD operations) in a MongoDB. This service was developed using Node.js and Express.

## How to run API

1) Clone repository: 
```
git clone git@github.com:LuisPeMoraRod/TI3600-P1-API.git
```
2) Install dependencies: 
```
npm i
```
3) Add `.env` file to root.
4) Run project: 
```
npm start
```
## How to run the 3 containers locally

1) Build images and spin up containers with Docker Compose
```
docker-compose up
```

2) Stop containers
```
docker-compose down
```

## How to run single Docker container locally

1) Build image:
```
docker build -t api:0.0.0 .
```

2) Run container (detached and removed when killed):
```
docker run -d -p 3000:3000 --name api-c --rm api:0.0.0
```

## Swagger Documentation
To access Swagger documentation, run the service and then go to: http://localhost:3000/api-docs/
