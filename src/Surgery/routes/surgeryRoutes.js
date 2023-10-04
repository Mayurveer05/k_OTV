const express = require("express");
const router = express.Router();


const { 
    createSurgery,
    updateSurgery,
    getSurgery,
    getAllSurgery,
    deleteSurgery,
    archiveSurgery,
    retriveSurgery
 } = require('../controllers/surgeryControllers');

router.route("/").get(getAllSurgery);
router.route("/:user_id").post(createSurgery);
router.route("/:surgery_id").put(updateSurgery).get(getSurgery).delete(deleteSurgery);
router.route("/archive/:surgery_id/").put(archiveSurgery);
router.route("/retrive/:surgery_id/").put(retriveSurgery);

module.exports = router;
