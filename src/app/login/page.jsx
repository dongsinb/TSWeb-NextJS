"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from "./login.module.css";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  }

  const handleLogin = async () => {
    try{
      // event.preventDefault();
      console.log(username)
      console.log(password)
      const response = await axios.get("http://localhost:5000/returnData", {
        auth: {
          username,
          password,
        },
      });
      console.log(response); // Debug log to check response
      if (response.status === 200) {
        toast("Login successfull");
        router.push('/dashboard');
      }
    } catch (error) {
      alert('Login failed. Please check your username or password.');
    }
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
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button onClick={handleLogin} className={styles.login}>Login</button>
        <button onClick={handleBack} className={styles.back}>Back</button>
      </div>
    </div>
  );
};

export default Login;
