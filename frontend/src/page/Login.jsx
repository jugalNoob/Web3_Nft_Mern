import React, { useEffect, useState } from 'react';

function Login() {

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

//   vishar@gmail.com

//jugal786

//\

  //validation ............
  const [errors, setErrors] = useState({});  //this for validation purpose 

  const validate = () => {  /// validation form 
    const errors = {};

  

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!pass) {
      errors.password = 'Password is required';
    }else if(pass.length<7){

      errors.password = 'enter more word';
    }

    return errors;
  };


  useEffect(()=>{


  },[])



  let timeout; // Make sure this is defined in the appropriate scope
  let count = 0; // Initialize count
  
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from submitting
    console.log("Count:", count++); // Track click count
  
    const errors = validate();
  
    clearTimeout(timeout); // Clear previous timeout
    timeout = setTimeout(async () => {
      if (Object.keys(errors).length === 0) { // Check for validation errors

        console.log("Email:", email);
        console.log("Password:", pass);
  
        try {
          const response = await fetch("http://localhost:9000/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password: pass }) // Use pass instead of pass for consistency
          });
  
          const res = await response.json();
          console.log(res)
          localStorage.setItem("usersdatatoken" , res.result.token)
          if (res.status === 201) {
            alert("Check your form");
          } else {
            console.log(res, 'user information'); // Assuming 'user' is part of the response
            // Uncomment and set your local storage or navigate as needed
            // localStorage.setItem("usersdatatoken", res.result.token);
            // localStorage.setItem("usersdatatokens", res.result.name);
            // navigate("/");
          }
        } catch (error) {
          console.error("Error during fetch:", error);
        }
      } else {
        setErrors(errors);
      }
  
      console.log(errors);
    }, 2000);
  };
  

  return (
    <div>
      <form>
       
       

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
              <p>  {errors.email && <span>{errors.email}</span>}</p> 

<br />
<br />

        <input
          type="password"
          placeholder="Enter your password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

<p>  {errors.pass && <span>{errors.pass}</span>}</p> 

<br />
<br />

        <button onClick={handleSubmit}>Click form</button>
      </form>
    </div>
  );
}

export default Login;