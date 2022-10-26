import { Router } from 'express';
import authValidator from '../auth/authValidator.js';
import { Form } from '../db/models/index.js';
import createHttpError from 'http-errors';
import sendEmail from '../tools/sendEmail.js';
import * as dotenv from 'dotenv';
dotenv.config();

const formRouter = Router();

formRouter.get('/', authValidator, async (req, res, next) => {
  try {
    let forms;
    const type = req.query.type;
    if (req.userRole === 'refugee') {
      if (type === 'preperation') {
        forms = await Form.findAll({
          where: { userId: req.userID, createdBy: 'refugee' },
        });
      } else if (type === 'validateForms') {
        forms = await Form.findAll({
          where: { userId: req.userID, createdBy: 'municipality' },
        });
      } else {
        forms = await Form.findAll({ where: { userId: req.userID } });
      }
    } else {
      if (type === 'preparedForms') {
        forms = await Form.findAll({ where: { createdBy: 'refugee' } });
      } else {
        forms = await Form.findAll({ where: { createdBy: 'municipality' } });
      }
    }
    if (forms) {
      const reshapedForms = forms.map((form) => {
        return {
          id: form.id,
          createdBy: form.createdBy,
          stage: form.stage,
          child: {
            firstName: form.firstName,
            lastname: form.lastName,
            gender: form.gender,
            birthday: form.birthday,
            birthbuilding: form.birthBuilding,
            birthtype: form.birthType,
            ssn: form.ssn,
            birthplace: form.birthPlace,
            birthwitness: form.birthWitness,
          },
          responsible: {
            fullname: form.responsibleFullName,
            residency: form.responsibleResidency,
            category: form.responsibleCategory,
          },
          doctor: {
            fullname: form.doctorFullName,
            residency: form.doctorResidency,
            phone: form.doctorPhone,
          },
          father: {
            lastName: form.fatherLastName,
            firstName: form.fatherFirstName,
            citizenship: form.fatherCitizenship,
            residency: form.fatherResidency,
            religion: form.fatherReligion,
            faith: form.fatherFaith,
            municipalityRegistered: form.fatherMunicipalityRegistered,
            municipalityId: form.fatherMunicipalityId,
            vat: form.fatherVat,
            ssn: form.fatherSsn,
            ssprovider: form.fatherSsProvider,
          },
          mother: {
            lastName: form.motherLastName,
            firstName: form.motherFirstName,
            citizenship: form.motherCitizenship,
            residency: form.motherResidency,
            religion: form.motherReligion,
            faith: form.motherFaith,
            municipalityRegistered: form.motherMunicipalityRegistered,
            municipalityId: form.motherMunicipalityId,
            vat: form.motherVat,
            ssn: form.motherSsn,
            ssprovider: form.motherSsProvider,
          },
          residency: {
            city: form.residencyCity,
            address: form.residencyAddress,
            phone: form.phone,
          },
          createdAt: form.createdAt,
          updatedAt: form.updatedAt,
          userId: form.userId,
        };
      });
      res.send(reshapedForms);
    } else {
      next(createHttpError(404, 'No forms found'));
    }
  } catch (error) {
    next(error);
  }
});

formRouter.post('/', authValidator, async (req, res, next) => {
  try {
    const numOfForms = await Form.count({
      where: { userId: req.userID, createdBy: 'refugee', stage: ['edit', 'done'] },
    });

    if (numOfForms >= 2) {
      next(createHttpError(400, 'You cant create more than 2 forms'));
    } else {
      const reshapedData = {
        firstName: req.body.child?.firstName,
        lastName: req.body.child?.lastName,
        gender: req.body.child?.gender,
        birthday: req.body.child?.birthday,
        birthBuilding: req.body.child?.birthbuilding,
        birthType: req.body.child?.birthtype,
        birthPlace: req.body.child?.birthplace,
        birthWitness: req.body.child?.birthwitness,
        ssn: req.body.child?.ssn,
        responsibleFullName: req.body.responsible?.fullname,
        responsibleResidency: req.body.responsible?.residency,
        responsibleCategory: req.body.responsible?.category,
        doctorFullName: req.body.doctor?.fullname,
        doctorResidency: req.body.doctor?.residency,
        doctorPhone: req.body.doctor?.phone,
        fatherFirstName: req.body.father?.firstName,
        fatherLastName: req.body.father?.lastName,
        fatherCitizenship: req.body.father?.citizenship,
        fatherResidency: req.body.father?.residency,
        fatherReligion: req.body.father?.religion,
        fatherFaith: req.body.father?.faith,
        fatherMunicipalityRegistered: req.body.father?.municipalityRegistered,
        fatherMunicipalityId: req.body.father?.municipalityId,
        fatherVat: req.body.father?.vat,
        fatherSsn: req.body.father?.ssn,
        fatherSsProvider: req.body.father?.ssprovider,
        motherFirstName: req.body.mother?.firstName,
        motherLastName: req.body.mother?.lastName,
        motherCitizenship: req.body.mother?.citizenship,
        motherResidency: req.body.mother?.residency,
        motherReligion: req.body.mother?.religion,
        motherFaith: req.body.mother?.faith,
        motherMunicipalityRegistered: req.body.mother?.municipalityRegistered,
        motherMunicipalityId: req.body.mother?.municipalityId,
        motherVat: req.body.mother?.vat,
        motherSsn: req.body.mother?.ssn,
        motherSsProvider: req.body.mother?.ssprovider,
        residencyCity: req.body.residency?.city,
        residencyAddress: req.body.residency?.address,
        phone: req.body.residency?.phone,
      };

      const newForm = await Form.create({
        ...reshapedData,
        userId: req.userRole === 'municipality' ? req.body?.userId : req.userID,
        createdBy: req.userRole,
      });

      if (newForm) {
        res.status(201).send(newForm);
      } else {
        next(createHttpError(400, 'Failed to create form'));
      }
    }
  } catch (error) {
    next(error);
  }
});

formRouter.get('/:id', authValidator, async (req, res, next) => {
  try {
    const form = await Form.findByPk(req.params.id);
    if (form) {
      if (form.userId === req.userID || req.userRole === 'municipality') {
        const reshapedForm = {
          id: form.id,
          createdBy: form.createdBy,
          stage: form.stage,
          child: {
            firstName: form.firstName,
            lastname: form.lastName,
            gender: form.gender,
            birthday: form.birthday,
            birthbuilding: form.birthBuilding,
            birthtype: form.birthType,
            ssn: form.ssn,
            birthplace: form.birthPlace,
            birthwitness: form.birthWitness,
          },
          responsible: {
            fullname: form.responsibleFullName,
            residency: form.responsibleResidency,
            category: form.responsibleCategory,
          },
          doctor: {
            fullname: form.doctorFullName,
            residency: form.doctorResidency,
            phone: form.doctorPhone,
          },
          father: {
            lastName: form.fatherLastName,
            firstName: form.fatherFirstName,
            citizenship: form.fatherCitizenship,
            residency: form.fatherResidency,
            religion: form.fatherReligion,
            faith: form.fatherFaith,
            municipalityRegistered: form.fatherMunicipalityRegistered,
            municipalityId: form.fatherMunicipalityId,
            vat: form.fatherVat,
            ssn: form.fatherSsn,
            ssprovider: form.fatherSsProvider,
          },
          mother: {
            lastName: form.motherLastName,
            firstName: form.motherFirstName,
            citizenship: form.motherCitizenship,
            residency: form.motherResidency,
            religion: form.motherReligion,
            faith: form.motherFaith,
            municipalityRegistered: form.motherMunicipalityRegistered,
            municipalityId: form.motherMunicipalityId,
            vat: form.motherVat,
            ssn: form.motherSsn,
            ssprovider: form.motherSsProvider,
          },
          residency: {
            city: form.residencyCity,
            address: form.residencyAddress,
            phone: form.phone,
          },
          createdAt: form.createdAt,
          updatedAt: form.updatedAt,
          userId: form.userId,
        };
        res.send(reshapedForm);
      } else {
        next(403, 'You dont have access to this form');
      }
    } else {
      next(createHttpError(404, 'Form not found'));
    }
  } catch (error) {
    next(error);
  }
});

formRouter.put('/:id', authValidator, async (req, res, next) => {
  try {
    const form = await Form.findByPk(req.params.id);
    if (form) {
      if (form.userId === req.userID || req.userRole === 'municipality') {
        const reshapedForm = {
          firstName: req.body.child?.firstName,
          lastName: req.body.child?.lastname,
          gender: req.body.child?.gender,
          birthday: req.body.child?.birthday,
          birthBuilding: req.body.child?.birthbuilding,
          birthType: req.body.child?.birthtype,
          birthPlace: req.body.child?.birthplace,
          birthWitness: req.body.child?.birthwitness,
          ssn: req.body.child?.ssn,
          responsibleFullName: req.body.responsible?.fullname,
          responsibleResidency: req.body.responsible?.residency,
          responsibleCategory: req.body.responsible?.category,
          doctorFullName: req.body.doctor?.fullname,
          doctorResidency: req.body.doctor?.residency,
          doctorPhone: req.body.doctor?.phone,
          fatherFirstName: req.body.father?.firstName,
          fatherLastName: req.body.father?.lastName,
          fatherCitizenship: req.body.father?.citizenship,
          fatherResidency: req.body.father?.residency,
          fatherReligion: req.body.father?.religion,
          fatherFaith: req.body.father?.faith,
          fatherMunicipalityRegistered: req.body.father?.municipalityRegistered,
          fatherMunicipalityId: req.body.father?.municipalityId,
          fatherVat: req.body.father?.vat,
          fatherSsn: req.body.father?.ssn,
          fatherSsProvider: req.body.father?.ssprovider,
          motherFirstName: req.body.mother?.firstName,
          motherLastName: req.body.mother?.lastName,
          motherCitizenship: req.body.mother?.citizenship,
          motherResidency: req.body.mother?.residency,
          motherReligion: req.body.mother?.religion,
          motherFaith: req.body.mother?.faith,
          motherMunicipalityRegistered: req.body.mother?.municipalityRegistered,
          motherMunicipalityId: req.body.mother?.municipalityId,
          motherVat: req.body.mother?.vat,
          motherSsn: req.body.mother?.ssn,
          motherSsProvider: req.body.mother?.ssprovider,
          residencyCity: req.body.residency?.city,
          residencyAddress: req.body.residency?.address,
          phone: req.body.residency?.phone,
          stage: req.body.stage,
        };
        const updatedForm = await Form.update(reshapedForm, {
          where: { id: req.params.id },
          returning: true,
        });
        const reshapedFormToSend = {
          id: updatedForm[1][0]?.id,
          createdBy: updatedForm[1][0]?.createdBy,
          stage: updatedForm[1][0]?.stage,
          child: {
            firstName: updatedForm[1][0]?.firstName,
            lastname: updatedForm[1][0]?.lastName,
            gender: updatedForm[1][0]?.gender,
            birthday: updatedForm[1][0]?.birthday,
            birthbuilding: updatedForm[1][0]?.birthBuilding,
            birthtype: updatedForm[1][0]?.birthType,
            ssn: updatedForm[1][0]?.ssn,
            birthplace: updatedForm[1][0]?.birthPlace,
            birthwitness: updatedForm[1][0]?.birthWitness,
          },
          responsible: {
            fullname: updatedForm[1][0]?.responsibleFullName,
            residency: updatedForm[1][0]?.responsibleFResidency,
            category: updatedForm[1][0]?.responsibleFirstName,
          },
          doctor: {
            fullname: updatedForm[1][0]?.doctorFullName,
            residency: updatedForm[1][0]?.doctorResidency,
            phone: updatedForm[1][0]?.doctorPhone,
          },
          father: {
            lastName: updatedForm[1][0]?.fatherLastName,
            firstName: updatedForm[1][0]?.fatherFirstName,
            citizenship: updatedForm[1][0]?.fatherCitizenship,
            residency: updatedForm[1][0]?.fatherResidency,
            religion: updatedForm[1][0]?.fatherReligion,
            faith: updatedForm[1][0]?.fatherFaith,
            municipalityRegistered: updatedForm[1][0]?.fatherMunicipalityRegistered,
            municipalityId: updatedForm[1][0]?.fatherMunicipalityId,
            vat: updatedForm[1][0]?.fatherVat,
            ssn: updatedForm[1][0]?.fatherSsn,
            ssprovider: updatedForm[1][0]?.fatherSsProvider,
          },
          mother: {
            lastName: updatedForm[1][0]?.motherLastName,
            firstName: updatedForm[1][0]?.motherFirstName,
            citizenship: updatedForm[1][0]?.motherCitizenship,
            residency: updatedForm[1][0]?.motherResidency,
            religion: updatedForm[1][0]?.motherReligion,
            faith: updatedForm[1][0]?.motherFaith,
            municipalityRegistered: updatedForm[1][0]?.motherMunicipalityRegistered,
            municipalityId: updatedForm[1][0]?.motherMunicipalityId,
            vat: updatedForm[1][0]?.motherVat,
            ssn: updatedForm[1][0]?.motherSsn,
            ssprovider: updatedForm[1][0]?.motherSsProvider,
          },
          residency: {
            city: updatedForm[1][0]?.residencyCity,
            address: updatedForm[1][0]?.residencyAddress,
            phone: updatedForm[1][0]?.phone,
          },
          createdAt: updatedForm[1][0]?.createdAt,
          updatedAt: updatedForm[1][0]?.updatedAt,
          userId: updatedForm[1][0]?.userId,
        };

        console.log(req);
        if (req.body.stage === 'done' && req.userRole !== 'municipality') {
          const duplicatedForm = await Form.create({
            ...reshapedForm,
            userId: req.userID,
            stage: 'edit',
            createdBy: 'municipality',
          });

          try {
            await sendEmail(
              'Μια νεα φορμα υποβλήθηκε',
              `Μπορειτε να δειτε την φορμα εδω: ${process.env.FE_URL}/forms/${duplicatedForm?.dataValues?.id}`
            )
          } catch (error) {
            console.log(error)
          }
        }

        res.send(reshapedFormToSend);
      } else {
        next(403, 'You dont have access to this form');
      }
    } else {
      next(createHttpError(404, 'Form not found'));
    }
  } catch (error) {
    next(error);
  }
});

formRouter.delete('/:id', authValidator, async (req, res, next) => {
  try {
    const form = await Form.findByPk(req.params.id);
    if (form) {
      if (form.userId === req.userID || req.userRole === 'municipality') {
        const deletedForm = await Form.destroy({
          where: {
            id: req.params.id,
          },
        });
        if (deletedForm) {
          res.status(204).send();
        } else {
          next(400, 'Failed to delete form');
        }
      } else {
        next(403, 'You dont have access to this form');
      }
    } else {
      next(createHttpError(404, 'Form not found'));
    }
  } catch (error) {
    next(error);
  }
});

export default formRouter;
