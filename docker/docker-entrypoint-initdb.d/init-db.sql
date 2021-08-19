alter role postgres password 'password';
create database market_db with owner postgres;
\c market_db postgres;