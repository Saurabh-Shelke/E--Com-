const userModel = require("../../models/userModel");
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Configure Multer for image uploads


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/userProfilePics');  // Set your destination folder for profile pictures
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Rename the file with a timestamp
  }
});

// const profilePicPath = `/uploads/userProfilePics/${req.file.filename}`;
// user.profilePic = profilePicPath;

const abc = {};
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed (jpeg, jpg, png)'));
    }
  }
}).single('profilePic');  // Accept only one file and the field name is 'profilePic'

async function userSignUpController(req, res) {

  try {
    // Handle file upload
    upload(req, res, async function (err) {
      if (err) {
        return res.json({ error: true, success: false, message: err.message });
      }

      const { email, password, name, refferredbycode,mobileNo } = req.body;
      const defaultReferredByCode = refferredbycode ? refferredbycode : "VBX523";


      const user = await userModel.findOne({ email });

      if (user) {
        throw new Error("User already exists.");
      }

      if (!email) {
        throw new Error("Please provide an email");
      }
      if (!password) {
        throw new Error("Please provide a password");
      }
      if (!name) {
        throw new Error("Please provide a name");
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPassword = await bcrypt.hashSync(password, salt);

      if (!hashPassword) {
        throw new Error("Something went wrong with password encryption");
      }

      // Function to generate referral code
      function generateReferralCode() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        let code = '';

        for (let i = 0; i < 3; i++) {
          code += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        for (let i = 0; i < 3; i++) {
          code += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }

        return code;
      }

      const referralCode = generateReferralCode();

      const profilePicPath = req.file ? req.file.path : '';  // Save file path to DB if uploaded

      const payload = {
        email,
        password: hashPassword,
        role:"GENERAL",
        name,
        mobileNo,
        profilePic: profilePicPath,  // Save profile picture path in the user data
        refferal: {
          refferalcode: referralCode,
          refferredbycode:defaultReferredByCode  // Include the referredbycode from the request
        }
      };

      const userData = new userModel(payload);
      await userData.save();


      // Handle referral system
      if (userData.refferal.refferredbycode) {
        const referrer = await userModel.findOne({ 'refferal.refferalcode': userData.refferal.refferredbycode });
        
        if (referrer) {
          // Add the new user's ID and name to the referrer's myrefferals array
          referrer.refferal.myrefferals.push({
            userId: userData._id,
            name: userData.name
          });
      
          // Save the updated referrer details
          await referrer.save();
        }
      }
      

      const saveUser = await userData.save();

      res.status(201).json({
        data: saveUser,
        success: true,
        error: false,
        message:"User created successfully"
      });
    });

  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

module.exports = userSignUpController;