import { useState } from "react";
import { loginUser } from "../api/auth";
import type { LoginData } from "../api/auth";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const [loginForm, setLoginForm] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [isLoggingin, setIsLoggingin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleLogin() {
    if (isLoggingin) return;
    setLoginError(null);
    setIsLoggingin(true);

    try {
      await loginUser(loginForm);
      navigate("/trips");
    } catch (errorMessage) {
      console.error(errorMessage);
      setLoginError("ログインできませんでした");
    } finally {
      setIsLoggingin(false);
    }
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div>
          <label>
            メールアドレス：
            <input
              type="email"
              name="email"
              value={loginForm.email}
              required
              disabled={isLoggingin}
              onChange={(e) => {
                setLoginForm((prev) => {
                  return {
                    ...prev,
                    email: e.target.value,
                  };
                });
              }}
            />
          </label>
        </div>
        <div>
          <label>
            パスワード：
            <input
              type="password"
              name="password"
              value={loginForm.password}
              required
              disabled={isLoggingin}
              onChange={(e) => {
                setLoginForm((prev) => {
                  return {
                    ...prev,
                    password: e.target.value,
                  };
                });
              }}
            />
          </label>
        </div>
        <div>
          <button type="submit" disabled={isLoggingin}>
            {isLoggingin ? "ログイン中..." : "ログイン"}
          </button>
        </div>
      </form>
      {loginError && <p style={{ color: "red" }}>{loginError}</p>}
    </>
  );
}
