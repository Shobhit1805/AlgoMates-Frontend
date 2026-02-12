import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-base-200">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl rounded-2xl">
          <div className="card-body px-6 py-8 sm:px-8">
            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-1">
              {isLoginForm ? "Login" : "Sign Up"}
            </h2>
            <p className="text-sm opacity-70 text-center mb-6">
              {isLoginForm
                ? "Welcome back to Algomates"
                : "Create your Algomates account"}
            </p>

            {/* Form */}
            <div className="space-y-4">
              {!isLoginForm && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={firstName}
                    placeholder="First Name"
                    className="input input-bordered w-full"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    type="text"
                    value={lastName}
                    placeholder="Last Name"
                    className="input input-bordered w-full"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              )}

              <input
                type="email"
                value={emailId}
                placeholder="Email ID"
                className="input input-bordered w-full"
                onChange={(e) => setEmailId(e.target.value)}
              />

              {/* Password with Eye Toggle */}
              {/* Password with Eye Toggle (FIXED) */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Password"
                  className="input input-bordered w-full pr-10"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center
               z-10 opacity-60 hover:opacity-100 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
            )}

            {/* Button */}
            <button
              className="btn btn-primary w-full mt-6"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Login" : "Sign Up"}
            </button>

            {/* Switch */}
            <p
              className="text-center text-sm mt-5 cursor-pointer opacity-80 hover:opacity-100 transition"
              onClick={() => {
                setError("");
                setIsLoginForm((prev) => !prev);
              }}
            >
              {isLoginForm
                ? "New user? Sign up here"
                : "Already have an account? Login"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
