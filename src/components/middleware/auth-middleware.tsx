import { useEffect } from "react";
import { useNavigate } from "react-router";

interface Props {
  children: React.ReactNode;
}

const AuthMiddleware = ({ children }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Token expired or not present
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");

      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthMiddleware;
