import { useEffect } from "react";
import { useNavigate } from "react-router";

interface Props {
  children: React.ReactNode;
}

const GuestMiddleware = ({ children }: Props) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/dashboard/home", { replace: true });
    }
  }, [token, navigate]);

  return <>{children}</>;
};

export default GuestMiddleware;
