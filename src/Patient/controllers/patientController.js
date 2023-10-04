const asyncHandler = require("express-async-handler");
const Patient = require("../models/patientModel");
const User = require("../../User/models/userModel")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//@desc Get all patients
//@route GET /patients
//@access public
const getPatients = asyncHandler(async (req, res) => {
  try {
    const { limit, offset } = req.query;
    // Parse limit and offset from query parameters and convert them to integers
    const parsedLimit = parseInt(limit) || 10; // Default to 10 if limit is not provided
    const parsedOffset = parseInt(offset) || 0; // Default to 0 if offset is not provided
    // Fetch all patients from the database with limit and offset applied
    const patients = await Patient.findAll({
      limit: parsedLimit,
      offset: parsedOffset,
    });
    // Fetch the total count of patients in the database
    const totalPatients = await Patient.count();
    res.status(200).json({ patients: patients, count: totalPatients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//@desc Create a new patient under a user
//@route POST /patients/:user_id
//@access public
const createPatient = async (req, res) => {
    console.log('createPatient ^^^^^^^^^^^^^^^^^')
    const { user_id } = req.params;
    const {
      firstname,
      lastname,
      gender,
      dob,
      age,
      mobno,
      aadhar_no,
      abha_no,
      address,
      patient_history,
    } = req.body;
  
    try {
      // Find the user based on the provided user_id
      const user = await User.findByPk(user_id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Create the patient
      const patient = await Patient.create({
        firstname,
        lastname,
        gender,
        dob,
        age,
        mobno,
        aadhar_no,
        abha_no,
        address,
        patient_history,
        created_by: user_id, 
        user_id:user_id
      });
  
      // You might want to generate the patient_number here if needed
      patient.patient_number = 'PT' + patient.patient_id;
      await patient.save();
      res.status(201).json({ patient });
    } catch (error) {
      console.error("Error creating patient:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

//@desc Get a patient by patient_id
//@route GET patients/:patient_id
//@access public
const getPatient = asyncHandler(async (req, res) => {
  try {
    const patientId = req.params.patient_id;

    // Find the patient by patient_id
    const patient = await Patient.findByPk(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    // Exclude the 'password' field from the response
    const responsePatient = { ...patient.toJSON() };
    delete responsePatient.password;
    res.status(200).json(responsePatient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//@desc Update patient by patient_id
//@route PUT patients/:patient_id
//@access public
const updatePatient = asyncHandler(async (req, res) => {
  try {
    const patientId = req.params.patient_id;
    const {
        firstname,
        lastname,
        gender,
        dob,
        age,
        mobno,
        aadhar_no,
        abha_no,
        address,
        patient_history 
    } = req.body;

    // Find the patient by patient_id
    const patient = await Patient.findByPk(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Update patient fields
    patient.firstname = firstname;
    patient.lastname = lastname;
    patient.gender=gender;
    patient.dob=dob;
    patient.age=age;
    patient.mobno = mobno;
    patient.aadhar_no=aadhar_no,
    patient.abha_no=abha_no,
    patient.address=address,
    patient.patient_history=patient_history,
    patient.updated_by=''


    // Save the updated patient
    await patient.save();

    res.status(200).json({ message: "Patient updated successfully" });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//@desc Delete patient by patient_id
//@route DELETE /patients/:patient_id
//@access public
const deletePatient = asyncHandler(async (req, res) => {
  try {
    const patientId = req.params.patient_id;

    // Find the patient by patient_id
    const patient = await Patient.findByPk(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Delete the patient
    await patient.destroy();

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//@desc Patient archive by patient_id
//@route PUT /patients/archive/:patient_id
//@access public
const archivePatient = asyncHandler(async (req, res) => {
  try {
    const patientId = req.params.patient_id;
    // Find the patient by patient_id
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    patient.isActive = false;
    
    await patient.save();
    res.status(200).json({ message: "Patient archived successfully" });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//@desc Patient retrive by patient_id
//@route PUT /patients/retrive/:patient_id
//@access public
const retrivePatient = asyncHandler(async (req, res) => {
  try {
    const patientId = req.params.patient_id;
    // Find the patient by patient_id
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    patient.isActive = true;
    
    await patient.save();
    res.status(200).json({ message: "Patient retrived successfully" });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//@desc Search patient by firstname, lastname, patientname and role
//@route POST /patients/search/char
//@access public
const searchPatients = asyncHandler(async (req, res) => {
  try {
    console.log('searchPatients ********************** ')

    const { limit, offset, char } = req.query;
    const str = char.trim()
    // Parse limit and offset from query parameters and convert them to integers
    const parsedLimit = parseInt(limit) || 10; // Default to 10 if limit is not provided
    const parsedOffset = parseInt(offset) || 0; // Default to 0 if offset is not provided

    let whereCondition = {}; // Initialize an empty object for the WHERE condition

    // If search parameter is provided, add conditions for patientname and first name
    if (str) {
      whereCondition = {
        // patientname: char
        [Op.or]: [
          { patient_number: { [Op.like]: `%${str}%` } },
          { firstName: { [Op.like]: `%${str}%` } },
          { lastname: { [Op.like]: `%${str}%` } },
          { gender: { [Op.like]: `%${str}%` } },
        ]
      };
    }

    // Fetch all patients from the database with limit, offset, and search applied
    const patients = await Patient.findAll({
      limit: parsedLimit,
      offset: parsedOffset,
      where: whereCondition, // Apply the WHERE condition
    });

    // Fetch the total count of patients in the database with the same where condition
    const totalPatients = await Patient.count({ where: whereCondition });

    res.status(200).json({ patients, count: totalPatients });

  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = { 
  getPatients, 
  createPatient, 
  getPatient, 
  updatePatient, 
  deletePatient, 
  archivePatient, 
  retrivePatient, 
  searchPatients
};
