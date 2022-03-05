import { Sequelize } from "sequelize";

const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD } = process.env;

const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
  host: PGHOST,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export const testDB = async () => {
  try {
    await sequelize.authenticate({ logging: false });
    console.log("DB is authenticated");
  } catch (error) {
    console.log("Failed to authenticate", error);
  }
};

export default sequelize;
