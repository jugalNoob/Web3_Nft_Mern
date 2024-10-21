const Register = require("../models/student");
const shortid = require('shortid'); // Import shortid library
var bcrypt = require('bcryptjs');

exports.first = async (req, res) => {
    // Equivalent to window.location.hostname

    // console.log('Latitude: ' + position.coords.latitude);
    // console.log('Longitude: ' + position.coords.longitude);
    const hostname = req.hostname;
    // console.log(`Hostname: ${hostname}`);

    // Equivalent to window.location.pathname
    const pathname = req.path;
    // console.log(`Pathname: ${pathname}`);

    // Equivalent to window.location.protocol
    const protocol = req.protocol;
    // console.log(`Protocol: ${protocol}`);

    const href = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    // console.log(`Href: ${href}`);

    // Extract specific headers
    const headers = req.headers;
    const connection = headers['connection'];
    const host = headers['host'];
    const secChUaPlatform = headers['sec-ch-ua-platform'];
    const acceptLanguage = headers['accept-language'];
    const secChUa = headers['sec-ch-ua'];

    // Only server-side info
    const info = {
        'href': href,
        'IP Address': req.ip,
        'Host': req.hostname,
        'Pathname': req.path,
        'Protocol': req.protocol,
        'Connection': connection,
        'Host Header': host,
        'Sec-CH-UA-Platform': secChUaPlatform,
        'Accept-Language': acceptLanguage,
        'Sec-CH-UA': secChUa
    };

    // console.log(info);

    // Send the info object as a JSON response
    res.json(info);
};






//form of sigin 

exports.form=async(req,res)=>{

try {
    
    const { name, email, password } = req.body;

    if (!name ||!email ||!password) {
        throw new Error("All fields are required");
    }

    const userExist = await Register.findOne({ email: email });
    if (userExist) {
        return res.status(422).json({ error: 'User email already exists' });
    }

    const shortId = shortid.generate();

    console.log(shortId)


    const addData = new Register({
        name,
        email,
        password,
        shortId, // Ensure this field is included in your schema
       
    });
    const result = await addData.save();
    console.log(result)

  
 // Pass headers to generateAuthToken method
 const token = await addData.generateAuthToken(
    `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    req.ip,
    req.hostname,
    req.path,
    req.protocol,
    req.headers['connection'],
    req.headers['host'],
    req.headers['sec-ch-ua-platform'],
    req.headers['accept-language'],
    req.headers['sec-ch-ua']
);


//Simple way --->
// const token = await addData.generateAuthToken(); // Use the correct method name
// console.log("Generated token:", token);




    res.status(200).send({ 'success': result, 'token': token });
} catch (error) {
console.log(error)

res.status(400).send({'error': error}) 
}
}



//Login add  methods --->>
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please provide email and password" });
    }

    try {
        const userValid = await Register.findOne({ email });
        if (!userValid) {
            return res.status(422).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, userValid.password);
        if (!isMatch) {
            return res.status(422).json({ error: "Invalid email or password" });
        }

        const token = await userValid.generateAuthtokens();
        console.log("Generated token:", token);

        res.cookie("jwttoken", token, { 
            expires: new Date(Date.now() + 9000000),
            httpOnly: true, // Set HTTP only to prevent JavaScript access
            // Other cookie options if needed
        });

        console.log("Cookie set successfully");

        const result = {
            user: userValid,
            token
        };

        return res.status(200).json({ message: "Login successful", result });
    } catch (err) {
        console.error("Login error:", err);
        res.status(400).send({'error': err}) 
    }
}


// use authentication  method to Login ----------------->>

exports.auth = async (req, res, next) => {
    try {
      const userData = req.user;
      console.log(userData, "userData DashBord"); // Check if userData is defined
  
      if (!userData) {
        return res.status(401).json({ error: "User data not available" });
      }
  
      return res.status(200).json({ userData });
    } catch (error) {
      console.log(`Error from user route: ${error}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  /// ---------- Update Web Server  ------------------------------>>

  // Email password Update request 


  exports.update = async (req, res) => {
    try {
      const email = req.body.email;
      let password = req.body.password;
  
      console.log("Email:", email); // Check if email is received correctly
      console.log("Password:", password); // Check if password is received correctly
  
      // Find user by email first
      const user = await Register.findOne({ email: email });
      
      if (!user) {
        console.log("No user found for the given email.");
        return res.status(404).json({ error: "User not found all information" });
      }
    
      console.log("User found:", user); // Check the user object found in the database
  
      // Compare the new password with the current hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return res.status(400).json({ error: "New password cannot be the same as the old password" });
      }
  
      // Hash new password
      let hashpassword = await bcrypt.hash(password, 12);
  
      // Update user password
      const updatedUser = await Register.findOneAndUpdate(
        { email: email },
        { password: hashpassword },
        { new: true }
      );
  
      console.log("User updated:", updatedUser);
      res.status(200).send(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  


  //  Logout route ----------------------- >>>>> 

  ///Out Line Row class 0----------------- >>>>
exports.logout = async (req, res) => {

  // router.get("/logout", (req, res) => {
      try {
          console.log("hello hellow eolred");
          res.clearCookie("usercookie");
          res.status(200).send("UserLogout");
          // Update the user's session to indicate that they are logged out
          req.session.user = null;
  
          // Redirect the user to a different page after logout
          res.redirect("/login");
      } catch (error) {
          console.error("Error occurred during logout:", error);
          res.status(500).send("Error occurred during logout");
      }
  }




  ///second update logic class row class


// exports.update = async (req, res) => {
//     try {
//       const { email, password } = req.body;  // Destructure email and password from the request body
  
//       // Validate email and password are provided
//       if (!email || !password) {
//         return res.status(400).json({ error: "Email and password are required" });
//       }
  
//       // Find user by email
//       const user = await Register.findOne({ email: email });
      
//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }
  
//       // Compare the new password with the current hashed password
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (isMatch) {
//         return res.status(400).json({ error: "New password cannot be the same as the old password" });
//       }
  
//       // Hash new password
//       const hashpassword = await bcrypt.hash(password, 12);
  
//       // Update user's password
//       user.password = hashpassword;
//       await user.save();  // Save the updated user object
  
//       console.log("Password updated for user:", user);
//       res.status(200).json({ message: "Password updated successfully" });
//     } catch (error) {
//       console.error("Error updating password:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   };


//   password: '$2a$12$AgbmPlfvl6YIc5VmYmC.WOnr8bq7iBsYuyt6.gy.WCqYK6LLp3IYK',
// exports.first=async(req,res)=>{


//     // Equivalent to window.location.hostname
//     const hostname = req.hostname;
//     console.log(`Hostname: ${hostname}`);

//     // Equivalent to window.location.pathname
//     const pathname = req.path;
//     console.log(`Pathname: ${pathname}`);

//     // Equivalent to window.location.protocol
//     const protocol = req.protocol;
//     console.log(`Protocol: ${protocol}`);

//     const href = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
//     console.log(`Href: ${href}`);

//     const info = {
//         'href': href,
//         'IP Address': req.ip,
//         'Host': req.hostname,
//         'Pathname': req.path,
//         'Protocol': req.protocol,
//         'User Agent': navigator.userAgent,
//         'App Name': navigator.appName,
//         'App Version': navigator.appVersion,
//         'Platform': navigator.platform,
//         'Language': navigator.language,
//         'Online': navigator.onLine ? 'Yes' : 'No',
//         'Cookies Enabled': navigator.cookieEnabled ? 'Yes' : 'No'
//     };


//   res.json(info)


//     res.send('jugal')
// }