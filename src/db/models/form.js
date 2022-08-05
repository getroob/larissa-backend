import sequelize from "../index.js";
import s from "sequelize";
const { DataTypes } = s;

const Form = sequelize.define("form", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  createdBy: {
    type: DataTypes.ENUM(["municipality", "refugee"]),
    allowNull: false,
  },
  stage: {
    type: DataTypes.ENUM(["edit", "done", "deleted"]),
    allowNull: false,
    defaultValue: "edit",
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  gender: {
    type: DataTypes.STRING,
  },
  birthday: {
    type: DataTypes.STRING,
  },
  birthBuilding: {
    type: DataTypes.STRING,
  },
  birthType: {
    type: DataTypes.STRING,
  },
  birthPlace: {
    type: DataTypes.STRING,
  },
  birthWitness: {
    type: DataTypes.STRING,
  },
  ssn: {
    type: DataTypes.STRING,
  },
  responsibleFullName: {
    type: DataTypes.STRING,
  },
  responsibleResidency: {
    type: DataTypes.STRING,
  },
  responsibleCategory: {
    type: DataTypes.STRING,
  },
  doctorFullName: {
    type: DataTypes.STRING,
  },
  doctorResidency: {
    type: DataTypes.STRING,
  },
  doctorPhone: {
    type: DataTypes.STRING,
  },
  fatherFirstName: {
    type: DataTypes.STRING,
  },
  fatherLastName: {
    type: DataTypes.STRING,
  },
  fatherCitizenship: {
    type: DataTypes.STRING,
  },
  fatherResidency: {
    type: DataTypes.STRING,
  },
  fatherReligion: {
    type: DataTypes.STRING,
  },
  fatherFaith: {
    type: DataTypes.STRING,
  },
  fatherMunicipalityRegistered: {
    type: DataTypes.STRING,
  },
  fatherMunicipalityId: {
    type: DataTypes.STRING,
  },
  fatherVat: {
    type: DataTypes.STRING,
  },
  fatherSsn: {
    type: DataTypes.STRING,
  },
  fatherSsProvider: {
    type: DataTypes.STRING,
  },
  motherFirstName: {
    type: DataTypes.STRING,
  },
  motherLastName: {
    type: DataTypes.STRING,
  },
  motherCitizenship: {
    type: DataTypes.STRING,
  },
  motherResidency: {
    type: DataTypes.STRING,
  },
  motherReligion: {
    type: DataTypes.STRING,
  },
  motherFaith: {
    type: DataTypes.STRING,
  },
  motherMunicipalityRegistered: {
    type: DataTypes.STRING,
  },
  motherMunicipalityId: {
    type: DataTypes.STRING,
  },
  motherVat: {
    type: DataTypes.STRING,
  },
  motherSsn: {
    type: DataTypes.STRING,
  },
  motherSsProvider: {
    type: DataTypes.STRING,
  },
  residencyCity: {
    type: DataTypes.STRING,
  },
  residencyAddress: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
});

export default Form;
