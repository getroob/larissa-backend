import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();

const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD } = process.env;

const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
  host: PGHOST,
  dialect: 'mysql',
});

export const testDB = async () => {
  try {
    await sequelize.authenticate({ logging: false });
    console.log('DB is authenticated');
  } catch (error) {
    console.log('Failed to authenticate', error);
  }
};

export default sequelize;
