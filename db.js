import pgPromise from 'pg-promise';
const pgp = pgPromise();

const db = pgp({
    host: 'localhost',
    port: 5432,
    database: 'Dogs',
    user: 'postgres',
    password: '0451',
  });


export {db};