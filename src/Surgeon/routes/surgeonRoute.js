const express = require("express");
const router = express.Router();

const {createSurgeon, updateSurgeon, getSurgeons, getSurgeon, deleteSurgeon, archiveSurgeon, retriveSurgeon} = require("../conrtollers/surgeonController")


router.route("/").post(createSurgeon).get(getSurgeons);
router.route("/:surgeon_id").put(updateSurgeon).get(getSurgeon).delete(deleteSurgeon);
router.route("/archieve/:surgeon_id").put(archiveSurgeon);
router.route("/retrive/:surgeon_id").put(retriveSurgeon);


module.exports = router;