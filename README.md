# market

## Typical Developer Machine Setup

### Applications

* [Visual Studio Code](https://code.visualstudio.com/)
* A postgres database GUI ([pgAdmin](https://www.pgadmin.org/download/))

### Other libraries

* [node](https://nodejs.org/) - v15.2.0
* [npm](https://docs.npmjs.com/cli) - v7.0.8
* [Docker (with Docker Compose)](https://www.docker.com/products/docker-desktop) - latest
* [git](https://git-scm.com/downloads) - latest

### Docker

The app requires a postgres database. A compose file has been provided. In a bash terminal execute:

```
cd docker && docker-compose up -d 
```

Create or update `express-back-end/db.js` with the following content, so the app can access the database:

```db.js
user: 'postgres',
database: 'market_db',
host: 'localhost',
port: 5432
```

## NOTE

Right now the application's database is connected to AWS cloud. No need to setup the docker.

```
user: 'postgres',
password: 'admin123',
database: 'market_db',
host: 'market-db.cfsxy9eyo0nn.us-east-2.rds.amazonaws.com',
port: 5432
```

### React App

Navivate to the react directory and install the application's dependencies:

```
cd webapp && npm install
```

## Running The App

### React App

To start the app locally run:

```
cd webapp && npm start
```

### Express App

Navivate to the express directory and install the application's dependencies:

```
cd express-back-end && npm install
```

## Running The App

### React App

To start the app locally run:

```
cd express-back-end && npm start
```

# Access app as an Admin/Staff Account

```
Login as admin in localhost:3000 > username: `admin` password: `admin123`
```

```
Login as staff in localhost:3000 > username: `staff` password: `staff123`
```