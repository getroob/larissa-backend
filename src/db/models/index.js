import Form from "./form.js";
import User from "./user.js";
import Appointment from "./appointment.js";

User.hasMany(Form);
Form.belongsTo(User);

User.hasMany(Appointment);
Appointment.belongsTo(User);

export { User, Form, Appointment };
