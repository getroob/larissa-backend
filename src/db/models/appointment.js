import sequelize from "../index.js";
import s from "sequelize";
const { DataTypes } = s;

const Appointment = sequelize.define("appointment", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  datetime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Appointment;
