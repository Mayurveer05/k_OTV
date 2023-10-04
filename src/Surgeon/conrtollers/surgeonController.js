const asyncHandler = require("express-async-handler");

const Surgeon = require("../models/surgeonModel")
const Sequelize = require('sequelize');

//@desc Get all surgeons
//@route GET /surgeons
//@access public
const getSurgeons = asyncHandler(async (req, res) => {
    try {
      const { limit, offset } = req.query;
      // Parse limit and offset from query parameters and convert them to integers
      const parsedLimit = parseInt(limit) || 10; // Default to 10 if limit is not provided
      const parsedOffset = parseInt(offset) || 0; // Default to 0 if offset is not provided
      // Fetch all patients from the database with limit and offset applied
      const surgeons = await Surgeon.findAll({
        limit: parsedLimit,
        offset: parsedOffset,
      });
      // Fetch the total count of surgeons in the database
      const totalSurgeons = await Surgeon.count();
      res.status(200).json({ surgeons: surgeons, count: totalSurgeons });
    } catch (error) {
      console.error("Error fetching surgeons:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


//@desc Create a surgeon
//@route POST /surgeons
//@access public
const createSurgeon = asyncHandler(async (req, res) => {
    const { surgeonname } = req.body;

    try {
        // Create the user
        const surgeon = await Surgeon.create({
            surgeonname
        });
        console.log(`Surgeon created ${surgeon}`);
        res.status(201).json(surgeon);
    } catch (error) {
        console.error("Error creating surgeon:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


//@desc Update surgeon by surgeon_id
//@route PUT surgeons/:surgeon_id
//@access public
const updateSurgeon = asyncHandler(async (req, res) => {
    try {
        const surgeonId = req.params.surgeon_id;
        const { surgeonname } = req.body;

        // Find the surgeon by surgeon_id
        const surgeon = await Surgeon.findByPk(surgeonId);

        if (!surgeon) {
            return res.status(404).json({ message: "surgeon not found" });
        }

        // Update surgeon fields
        surgeon.surgeonname = surgeonname;


        // Save the updated surgeon
        await surgeon.save();

        res.status(200).json({ message: "Surgeon updated successfully" });
    } catch (error) {
        console.error("Error updating surgeon:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


//@desc Get a surgeon by surgeon_id
//@route GET surgeons/:surgeon_id
//@access public
const getSurgeon = asyncHandler(async (req, res) => {
    try {

        const surgeonId = req.params.surgeon_id;
        const surgeon = await Surgeon.findByPk(surgeonId);

        if (!surgeon) {
            return res.status(404).json({ message: "Surgeon not found" });
        }
        res.status(200).json(surgeon);
    } catch (error) {
        console.error("Error fetching surgeon:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//@desc Delete surgeon by surgeon_id
//@route DELETE /surgeons/:surgeon_id
//@access public
const deleteSurgeon = asyncHandler(async (req, res) => {
    try {
        const surgeonId = req.params.surgeon_id;

        // Find the user by surgeon_id
        const surgeon = await Surgeon.findByPk(surgeonId);

        if (!surgeon) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the user
        await surgeon.destroy();

        res.status(200).json({ message: "Surgeon deleted successfully" });
    } catch (error) {
        console.error("Error deleting surgeon:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


//@desc Patient archive by surgeon_id
//@route PUT /patients/archive/:surgeon_id
//@access public
const archiveSurgeon = asyncHandler(async (req, res) => {
    try {
        const surgeonId = req.params.surgeon_id;
        // Find the surgeon by patient_id
        const surgeon = await Surgeon.findByPk(surgeonId);
        if (!surgeon) {
            return res.status(404).json({ message: "Surgeon not found" });
        }
        surgeon.isActive = false;

        await surgeon.save();
        res.status(200).json({ message: "Surgeon archived successfully" });
    } catch (error) {
        console.error("Error updating surgeon:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


//@desc Patient retrive by surgeon_id
//@route PUT /patients/retrive/:surgeon_id
//@access public
const retriveSurgeon = asyncHandler(async (req, res) => {
    try {
        const surgeonId = req.params.surgeon_id;
        // Find the surgeon by patient_id
        const surgeon = await Surgeon.findByPk(surgeonId);
        if (!surgeon) {
            return res.status(404).json({ message: "Surgeon not found" });
        }
        surgeon.isActive = true;

        await surgeon.save();
        res.status(200).json({ message: "Surgeon archived successfully" });
    } catch (error) {
        console.error("Error updating surgeon:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = {
    createSurgeon,
    updateSurgeon,
    getSurgeons,
    getSurgeon,
    deleteSurgeon,
    archiveSurgeon,
    retriveSurgeon
}