const express = require("express");
const router = express.Router();

const {
  getPatients,
  createPatient,
  getPatient,
  updatePatient,
  deletePatient,
  archivePatient,
  retrivePatient,
  searchPatients
} = require("../controllers/patientController");


router.route("/").get(getPatients);
router.route("/:user_id").post(createPatient);
router.route("/:patient_id").get(getPatient).put(updatePatient).delete(deletePatient);
router.route("/archive/:patient_id").put(archivePatient);
router.route("/retrive/:patient_id").put(retrivePatient);
router.route("/search/char").post(searchPatients);

module.exports = router;
