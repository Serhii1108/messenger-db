import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  database: process.env.POSTGRES_DB,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  synchronize: true,
  entities: ['dist/**/entities/*.entity.js'],
  migrations: ['dist/**/migrations/*.js'],
});
