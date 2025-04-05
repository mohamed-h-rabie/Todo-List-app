import { AxiosError } from "axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useCheckEmailAvailabilty from "../hooks/useCheckEmailAvailabilty";

type Inputs = {
  username: string;
  email: string;
  password: string;
};
type TError = {
  error: {
    message: string;
  };
};
type TRegisterInput = {
  name: "email" | "username" | "password";
  placeholder: string;
  type: string;
};
const inputsForm: TRegisterInput[] = [
  {
    placeholder: "username",
    type: "text",
    name: "username",
  },
  {
    placeholder: "email",
    type: "text",
    name: "email",
  },
  {
    placeholder: "password",
    type: "password",
    name: "password",
  },
];
const schema = yup
  .object({
    username: yup.string().required("username is required"),
    email: yup
      .string()
      .required("email is required")
      .email("email is not valid"),
    password: yup
      .string()
      .required("password is required")
      .min(6, "Password should be at least 6 charachters."),
  })
  .required();
const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getFieldState,
  } = useForm({
    resolver: yupResolver(schema),
  });
  console.log(errors);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/auth/local/register", data);
      console.log(res);
      if (res.status === 200) {
        setIsLoading(false);

        toast.success(
          "You will navigate to the login page after 2 seconds to login."
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      const errorObject = error as AxiosError<TError>;
      console.error(errorObject.response?.data);
      toast.error(`${errorObject.response?.data.error.message}`);
      setIsLoading(false);
    }
  };
  const {
    enteredEmail,
    resetCheckEmailAvailability,
    checkEmailAvailability,
  } = useCheckEmailAvailabilty();
  async function onBlurHandler(e: React.FocusEvent<HTMLInputElement>) {
    await trigger("email");
    const value = e.target.value;
    const { isDirty, invalid } = getFieldState("email");

    if (isDirty && !invalid && enteredEmail !== value) {
      checkEmailAvailability(value);
    }
    if (isDirty && invalid && enteredEmail) {
      resetCheckEmailAvailability();
    }
  }

  ///RENDERS
  const renderRegistertionForm = inputsForm.map(
    ({ placeholder, type, name }, index) => {
      return (
        <div key={index}>
          <Input
            placeholder={placeholder}
            type={type}
            {...register(`${name}`)}
            onBlur={name === "email" ? onBlurHandler : undefined}
          />
          <p className="text-red-600">
            {errors[`${name}`] && errors[`${name}`]?.message}
          </p>
        </div>
      );
    }
  );
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Register to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderRegistertionForm}

        <Button isLoading={isLoading} className="mx-auto !mt-10">
          {isLoading ? "Loading... " : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
