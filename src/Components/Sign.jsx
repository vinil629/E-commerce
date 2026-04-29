import { useState } from "react";
import API from "../utlis/api"
import Register from "./Register";
import {Link,useNavigate} from 'react-router-dom';



function Sign(){

    const [name,setname]=useState("");
    const [email,setemail]=useState("");
    const [password,setpassword]=useState("");
  

    const navigate=useNavigate('/');

 const handlesignin = async (e) => {
    e.preventDefault();
    

    try {
      const res = await API.post('/login', { email, password });
      console.log("data", res);

      sessionStorage.setItem("token", res.data.token);
sessionStorage.setItem("refreshToken", res.data.refreshToken);

     
      navigate("/"); // ✅ goes to home — ProtectedRoute will now allow it
       alert("login successful");

    } catch (err) {
    //   console.log(err.response.data);
    //   alert("login failed");
    console.log("invalid email or data");
    //   setError("Invalid email or password");
    }

    setemail("");
    setpassword("");
  };



    return(
    <>
    

    <div className="signin-container">
  <form className="signin-form" onSubmit={handlesignin}>
    
    <h2 className="signin-title">Sign In</h2>

    <div className="input-group">
      <input
        type="email"
        onChange={(e) => setemail(e.target.value)}
        value={email}
        placeholder="Email address"
        required
      />
    </div>

    <div className="input-group">
      <input
        type="password"
        onChange={(e) => setpassword(e.target.value)}
        value={password}
        placeholder="Password"
        required
      />
    </div>

    <button className="signin-btn" type="submit">
      Sign In
    </button>

    <div className="signin-footer">
      <span>Don't have an account?</span>
      <Link to="/register">Create Account</Link>
    </div>

  </form>
</div>
    </>)
}

export default Sign;