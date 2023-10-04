const asyncHandler = require("express-async-handler");
const Surgery = require("../models/surgeryModel");
const User = require("../../User/models/userModel")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


//@desc Create a new surgery under a user
//@route POST /surgery/:user_id
//@access public
const createSurgery = async (req, res) => {
    const { user_id } = req.params;
    const { surgeryName } = req.body;
  
    try {
      // Find the user based on the provided user_id
      const user = await User.findByPk(user_id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Create the Surgery
      const surgery = await Surgery.create({
        surgeryName,
        created_by: user_id
      });
  
      await surgery.save();
      res.status(201).json({ surgery });
    } catch (error) {
      console.error("Error creating surgery:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

//@desc Update surgery by surgery_id
//@route PUT surgery/:surgery_id
//@access public
const updateSurgery = asyncHandler(async (req, res) => {
    try {
      const surgeryId = req.params.surgery_id;
      const { surgeryName } = req.body;
  
      // Find the surgery by surgery_id
      const surgery = await Surgery.findByPk(surgeryId);
  
      if (!surgery) {
        return res.status(404).json({ message: "surgery not found" });
      }
  
      // Update surgery fields
      surgery.surgeryName = surgeryName;
      
      // Save the updated surgery
      await surgery.save();
  
      res.status(200).json({ message: "surgery updated successfully" });
    } catch (error) {
      console.error("Error updating surgery:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

//@desc Get a surgery by surgery_id
//@route GET surgery/:surgery_id
//@access public
const getSurgery = asyncHandler(async (req, res) => {
    try {
      const surgeryId = req.params.surgery_id;
  
      // Find the surgery by surgery_id
      const surgery = await Surgery.findByPk(surgeryId);
  
      if (!surgery) {
        return res.status(404).json({ message: "surgery not found" });
      }
     
      res.status(200).json(surgery);
    } catch (error) {
      console.error("Error fetching surgery:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

//@desc Get all surgery
//@route GET /surgery
//@access public
const getAllSurgery = asyncHandler(async (req, res) => {
    try {
      const { limit, offset } = req.query;
      // Parse limit and offset from query parameters and convert them to integers
      const parsedLimit = parseInt(limit) || 10; // Default to 10 if limit is not provided
      const parsedOffset = parseInt(offset) || 0; // Default to 0 if offset is not provided
      // Fetch all surgery from the database with limit and offset applied
      const surgery = await Surgery.findAll({
        limit: parsedLimit,
        offset: parsedOffset,
      });
      // Fetch the total count of surgery in the database
      const totalsurgery = await Surgery.count();
      res.status(200).json({ surgery: surgery, count: totalsurgery });
    } catch (error) {
      console.error("Error fetching surgery:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

//@desc Delete Surgery by Surgery_id
//@route DELETE /surgery/:surgery_id
//@access public
const deleteSurgery = asyncHandler(async (req, res) => {
    try {
      const SurgeryId = req.params.surgery_id;
  
      // Find the Surgery by Surgery_id
      const surgery = await Surgery.findByPk(SurgeryId);
  
      if (!surgery) {
        return res.status(404).json({ message: "Surgery not found" });
      }
  
      // Delete the Surgery
      await surgery.destroy();
  
      res.status(200).json({ message: "Surgery deleted successfully" });
    } catch (error) {
      console.error("Error deleting surgery:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

//@desc Surgery archive by Surgery_id
//@route PUT /surgery/archive/:surgery_id
//@access public
const archiveSurgery = asyncHandler(async (req, res) => {
    try {
      const SurgeryId = req.params.surgery_id;
      // Find the Surgery by Surgery_id
      const surgery = await Surgery.findByPk(SurgeryId);
      if (!surgery) {
        return res.status(404).json({ message: "Surgery not found" });
      }
      surgery.isActive = false;
      
      await surgery.save();
      res.status(200).json({ message: "Surgery archived successfully" });
    } catch (error) {
      console.error("Error updating surgery:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  //@desc Surgery retrive by Surgery_id
  //@route PUT /surgery/retrive/:surgery_id
  //@access public
  const retriveSurgery = asyncHandler(async (req, res) => {
    try {
      const SurgeryId = req.params.surgery_id;
      // Find the Surgery by Surgery_id
      const surgery = await Surgery.findByPk(SurgeryId);
      if (!surgery) {
        return res.status(404).json({ message: "Surgery not found" });
      }
      surgery.isActive = true;
      
      await surgery.save();
      res.status(200).json({ message: "Surgery retrived successfully" });
    } catch (error) {
      console.error("Error updating surgery:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


module.exports = { 
  createSurgery,
  updateSurgery,
  getSurgery,
  getAllSurgery,
  deleteSurgery,
  archiveSurgery,
  retriveSurgery
};
