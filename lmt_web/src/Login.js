import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./Chatbot.css";
import { sendPost } from "./utils";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 模擬登入 API
    await sendPost(`${process.env.REACT_APP_API_URL}/login`,{User_ID:email,User_Pass:password},(response)=>{
        if(response.data){
            navigate('/dashboard',{replace:true})
        }else{
            alert("email or password wrong");
        }
    })
    
  };
    return (
    <div
      className=" base d-flex align-items-center justify-content-center vh-100"
      
    >
      <div className="bg-dark card shadow-lg p-4" style={{ width: "100%", maxWidth: 400 }}>
        <h3 className="text-center mb-4 text-primary">Login</h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">
              Email
            </label>
            <input
              id="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">
              密碼
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger py-2 text-center">{error}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={loading}
          >
            {loading ? "Login..." : "Login"}
          </button>
          <p className="text-light"> if you like<br/>,contact <a>kwochengho1020318@gmail.com</a> for a demo account</p>
        </form>
      </div>
    </div>
  );
}

