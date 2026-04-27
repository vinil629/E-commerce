import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utlis/api"


function Register(){

      const [username, setusername] = useState("");
  const [email, setmail]        = useState("");
  const [password, setpassword] = useState("");
  const [error, setError]       = useState(""); // ✅ added error state

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/register", { username, email, password });
      alert("User registered successfully");
      navigate("/Sign");

    } catch (err) {
      const message = err.response?.data?.message || err.message;
      console.log("register error:", message);
      setError("Registration failed. Try again.");
    }

    setusername("");
    setmail("");
    setpassword("");
  };
 return(
        <div className="signin-container">
      <form className="signin-form" onSubmit={handleRegister}>
        <h2 className="signin-heading">Create Account</h2>

        {/* ✅ shows error if registration fails */}
        {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          className="signin-input"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setmail(e.target.value)}
          className="signin-input"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          className="signin-input"
          required
        />

        <button type="submit" className="signin-btn">Register</button>

        {/* ✅ link back to signin — same as signin has link to register */}
        <div className="signin-footer">
         <button onClick={()=>navigate('/signin')}>Sign</button>
        </div>

      </form>
    </div>
    )
}

export default Register;