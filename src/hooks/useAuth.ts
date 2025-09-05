const useAuth = () => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  const userData = user ? JSON.parse(user) : null;

  return { user: userData, token };
};

export default useAuth;