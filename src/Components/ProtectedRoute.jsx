import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  

  const token = localStorage.getItem("token"); // ✅ localStorage matches Sign.jsx

  // ✅ No token at all — redirect to signin
  if (!token) {

    alert("To see Cartitems . user must be Signin");
    return <Navigate to="/signin" replace />;
  }

  try {
    const decoded  = JSON.parse(atob(token.split('.')[1]));
    const isExpired = decoded.exp * 1000 < Date.now();

    // ✅ Fixed: isExpired (not !isExpired)
    if (isExpired) {
      localStorage.removeItem("token");         // ✅ removeItem not remove
      localStorage.removeItem("refreshToken");  // ✅ localStorage not sessionStorage
      return <Navigate to="/signin" replace />; // ✅ lowercase signin
    }

  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/signin" replace />;   // ✅ lowercase signin
  }

  return children; // ✅ fixed typo: children not childeren
}

export default ProtectedRoute;

   



    


   
