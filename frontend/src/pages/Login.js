import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/UserAction";
import Button from "../components/Button";
import AlertMessage from "../components/AlertMessage";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");

    if (!password) {
      setErrMsg("Password is required.");
      setLoading(false);
      return;
    }

    if (password === process.env.REACT_APP_SITE_PASSWORD) {
      dispatch(setUser(true));
      setLoading(false);
      navigate("/");
    } else {
      setErrMsg("Incorrect password.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const backgroundText = "crow's nest";
    const backgroundElement = document.getElementById("background");
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const textWidth = 120;
    const textHeight = 30;

    const rows = Math.ceil(screenHeight / textHeight);
    const columns = Math.ceil(screenWidth / textWidth);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const textElement = document.createElement("div");
        textElement.innerText = backgroundText;
        textElement.classList.add("absolute", "text-white", "opacity-10", "text-xl");
        textElement.style.top = `${i * textHeight}px`;
        textElement.style.left = `${j * textWidth}px`;
        backgroundElement.appendChild(textElement);
      }
    }
  }, []);

  return (
    <Layout title="Login">
      <div className="relative flex items-center justify-center h-full bg-primary rounded-lg">
        <div
          id="background"
          className="absolute inset-0 z-0 overflow-hidden text-nowrap"
        ></div>
        <div className="relative z-10 w-full max-w-md p-4 space-y-4 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-center">Login</h1>
          {errMsg && <AlertMessage msg={errMsg} type="error" />}
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="block">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrMsg("")
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <Button
              type="submit"
              title="Login"
              loading={loading}
              text="Login"
              full
              className="mt-4"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
}