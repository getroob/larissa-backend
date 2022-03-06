import { Router } from "express";
import authValidator from "../auth/authValidator.js";
import { Appointment } from "../db/models/index.js";
import createHttpError from "http-errors";

const appointmentRouter = Router();

appointmentRouter.get("/", authValidator, async (req, res, next) => {
  try {
    let appointments;
    if (req.userRole === "municipality") {
      appointments = await Appointment.findAll();
    } else {
      appointments = await Appointment.findAll({
        where: { userId: req.userID },
      });
    }
    if (appointments) {
      res.send(appointments);
    } else {
      next(createHttpError(400, "Appointments not found"));
    }
  } catch (error) {
    next(error);
  }
});

appointmentRouter.post("/", authValidator, async (req, res, next) => {
  try {
    if (req.userRole === "municipality") {
      next(createHttpError(400, "You cant book appointment with yourself"));
    } else {
      const newAppointment = await Appointment.create({
        datetime: req.body.datetime,
        userId: req.userID,
      });
      if (newAppointment) {
        res.status(201).send(newAppointment);
      } else {
        next(createHttpError(400, "Failed to post appointment"));
      }
    }
  } catch (error) {
    next(error);
  }
});

appointmentRouter.put("/:id", authValidator, async (req, res, next) => {
  try {
    if (req.userRole === "municipality") {
      next(createHttpError(400, "You cant book appointment with yourself"));
    } else {
      const appointment = await Appointment.findByPk(req.params.id);
      if (appointment?.userId === req.userID) {
        const updatedAppointment = await Appointment.update(
          {
            datetime: req.body.datetime,
          },
          {
            where: { id: req.params.id },
            returning: true,
          }
        );
        if (updatedAppointment[0] === 1) {
          res.send(updatedAppointment[1][0]);
        } else {
          next(createHttpError(400, "Failed to post appointment"));
        }
      } else {
      }
    }
  } catch (error) {
    next(error);
  }
});

appointmentRouter.delete("/:id", authValidator, async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (appointment) {
      if (appointment.userId === req.userID) {
        const deletedForm = await Appointment.destroy({
          where: {
            id: req.params.id,
          },
        });
        if (deletedForm) {
          res.status(204).send();
        } else {
          next(400, "Failed to delete form");
        }
      } else {
        next(403, "You dont have access to this form");
      }
    } else {
      next(createHttpError(404, "Appointment not found"));
    }
  } catch (error) {
    next(error);
  }
});

export default appointmentRouter;
