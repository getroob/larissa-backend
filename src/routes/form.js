import { Router } from "express";
import authValidator from "../auth/authValidator.js";
import { Form } from "../db/models/index.js";
import createHttpError from "http-errors";

const formRouter = Router();

formRouter.get("/", authValidator, async (req, res, next) => {
  try {
    let forms;
    if (req.userRole === "refugee") {
      forms = await Form.findAll({ where: { userId: req.userID } });
    } else {
      forms = await Form.findAll({ where: { createdBy: "municipality" } });
    }
    if (forms) {
      res.send(forms);
    } else {
      next(createHttpError(404, "No forms found"));
    }
  } catch (error) {
    next(error);
  }
});

formRouter.post("/", authValidator, async (req, res, next) => {
  try {
    //   console.log(req.userID, req.userRole);
    //   console.log(req.body);
    const newForm = await Form.create({
      ...req.body,
      userId: req.userRole === "municipality" ? req.body?.userId : req.userID,
      createdBy: req.userRole,
    });
    //   console.log(newForm);
    if (newForm) {
      res.status(201).send(newForm);
    } else {
      next(createHttpError(400, "Failed to create form"));
    }
  } catch (error) {
    next(error);
  }
});

formRouter.get("/:id", authValidator, async (req, res, next) => {
  try {
    const form = await Form.findByPk(req.params.id);
    if (form) {
      if (form.userId === req.userID) {
        res.send(form);
      } else {
        next(403, "You dont have access to this form");
      }
    } else {
      next(createHttpError(404, "Form not found"));
    }
  } catch (error) {
    next(error);
  }
});

formRouter.put("/:id", authValidator, async (req, res, next) => {
  try {
    const form = await Form.findByPk(req.params.id);
    if (form) {
      if (
        form.userId === req.userID ||
        (req.userRole === "municipality" && form.createdBy === "municipality")
      ) {
        const updatedForm = await Form.update(req.body, {
          where: { id: req.params.id },
          returning: true,
        });
        if (updatedForm[0] === 1) {
          res.send(updatedForm[1][0]);
        } else {
          next(createHttpError(400, "Failed to update form"));
        }
      } else {
        next(403, "You dont have access to this form");
      }
    } else {
      next(createHttpError(404, "Form not found"));
    }
  } catch (error) {
    next(error);
  }
});

formRouter.delete("/:id", authValidator, async (req, res, next) => {
  try {
    const form = await Form.findByPk(req.params.id);
    if (form) {
      if (
        form.userId === req.userID ||
        (req.userRole === "municipality" && form.createdBy === "municipality")
      ) {
        const deletedForm = await Form.destroy({
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
      next(createHttpError(404, "Form not found"));
    }
  } catch (error) {
    next(error);
  }
});

export default formRouter;
