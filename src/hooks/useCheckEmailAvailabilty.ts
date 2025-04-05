/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axiosInstance from "../config/axios.config";
type TStatus = "checking" | "available" | "notAvailable" | "idle" | "failed";
export default function useCheckEmailAvailabilty() {
  const [enteredEmail, setEnteredEmail] = useState<string | null>(null);
  const [emailAvailabilityStatus, setEmailAvailabilityStatus] =
    useState<TStatus>("idle");

  async function checkEmailAvailability(email: string) {
    setEmailAvailabilityStatus("checking");
    setEnteredEmail(email);
    
    try {
      const res = await axiosInstance.get("/users");
      const emailFinder = res.data.find(
        (user: any) => user.email === email
      );

      if (emailFinder) {
        setEmailAvailabilityStatus("notAvailable");
      } else {
        setEmailAvailabilityStatus("available");
      }
    } catch (error) {
      console.error(error);
      setEmailAvailabilityStatus("failed");
    }
  }
  const resetCheckEmailAvailability = () => {
    setEnteredEmail(null);
    setEmailAvailabilityStatus("idle");
  };
  return {
    enteredEmail,
    emailAvailabilityStatus,
    checkEmailAvailability,
    resetCheckEmailAvailability,
  };
}
