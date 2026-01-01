import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await axios.get(
          "http://localhost:4000/api/auth/me",
          { withCredentials: true }
        );

        // Cookie is valid → user is logged in
        navigate("/home");
      } catch {
        navigate("/login");
      }
    };

    verifyLogin();
  }, []);

  return <p>Signing you in…</p>;
};

export default OAuthSuccess;
