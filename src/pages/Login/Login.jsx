import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import Button from "../../components/Button";
import axios from "../../utils/Axios";
import { toast, Bounce } from "react-toastify";
import { loginSchema } from "../../utils/validations/UserSchema";
import backgroundImg from "../../assets/images/background-image.jpg";
import Sonner from "../../components/Sonner";
import { useMutation } from "@tanstack/react-query";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      return axios.post("/api/v1/login", formData);
    },
    onSuccess: (response) => {
      const data = response.data;
      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("userName", data.data.user.name);
      localStorage.setItem("userEmail", data.data.user.email);
      setFormData({ email: "", password: "" });
      toast.success("Successfully Logged In!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (value === "") {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });

    try {
      loginSchema.parse(formData);
      loginMutation.mutate(formData);
    } catch (error) {
      if (error.name === "ZodError") {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  useEffect(() => {
    document.title = "Sign In - Task Management";
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="bg-white bg-cover bg-bottom flex justify-center items-center flex-1"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="bg-gray-100 bg-opacity-90 px-5 py-10 rounded-md shadow-md w-[90%] max-w-[400px] md:max-w-[350px] lg:w-[30%]">
          <h1 className="font-poppins text-2xl font-bold text-center mb-5">
            Task Management
          </h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h2 className="font-poppins font-bold text-xl text-center">
              Sign In
            </h2>
            <div className="flex items-center gap-2">
              <FaUser className="text-black" />
              <input
                className="flex-1 py-2 px-3 border rounded-md"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
            <div className="flex items-center gap-2">
              <FaLock className="text-black" />
              <input
                className="flex-1 py-2 px-3 border rounded-md"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
            <Button
              className="bg-blue-400 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
              type="submit"
              disabled={loginMutation.isLoading}
            >
              {loginMutation.isLoading ? <Sonner /> : "Log In"}
            </Button>
            <p className="text-center text-sm mt-4">
              Don't have an account?{" "}
              <Link className="text-blue-500 hover:underline" to={"/sign-up"}>
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
