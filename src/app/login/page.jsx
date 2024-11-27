"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./login.module.css";
import { toast } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  const handleLogin = async () => {
    try {
      // event.preventDefault();
      console.log(username);
      console.log(password);
      const response = await axios.post("/api/login", { username, password });
      //   const response = await axios.get("http://localhost:5000/checkLogin", {
      //     auth: {
      //       username,
      //       password,
      //     },
      //   });
      console.log(response); // Debug log to check response
      if (response.status === 200) {
        toast.success("Login successfull");
        router.push("/home");
      }
    } catch (error) {
      alert("Login failed. Please check your username or password.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div className={styles.passwordContainer}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className={styles.toggleIcon}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>
        <button onClick={handleLogin} className={styles.login}>
          Login
        </button>
        <button onClick={handleBack} className={styles.back}>
          Back
        </button>
      </div>
    </div>
  );
};

export default Login;
