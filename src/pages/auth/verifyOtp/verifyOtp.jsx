
import ConfirmPasswordImage from "../../../assets/images/confirmPasswordImage.png";
import { useState, useRef } from "react";
import { useSignIn } from "../../../hooks/auth/useSignIn";
import { useNavigate } from "react-router-dom"; 
const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const { verifyOtp, otpRes,loading } = useSignIn();
  const navigate = useNavigate(); 

  const handleInputChange = (e, index) => {
    if (/^[a-zA-Z0-9]$/.test(e.target.value) || e.target.value === "") {
      const newOtp = [...otp];
      newOtp[index] = e.target.value;
      setOtp(newOtp);
    }
    if (e.target.value !== "" && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // Converting the array of otp to the string
  //   const otpString = otp.join("").trim();

  //   const email = sessionStorage.getItem("email");

  //   const data = {
  //     otp: otpString,
  //     email: email,
  //   };
  //   verifyOtp(data);

  //   try {
  //     console.log("OTP and email sent: ", { otp: otpString, email });

  //     console.log("Otp Response: ", otpRes);
  //     if (otpRes) {
  //       // Check if response is successful
  //       navigate("/confirm-password");
  //     }
  //   } catch (error) {
  //     console.error("Error during OTP verification:", error);
  //   }
  // };
const handleSubmit = async (e) => {
  e.preventDefault();


  const otpString = otp.join("").trim();
  const email = sessionStorage.getItem("email");

  const data = { otp: otpString, email };

  try {
    console.log("OTP and email sent: ", data);

  
    const res = await verifyOtp(data);

    console.log("Otp Response: ", res);

    if (res) {
    
      navigate("/confirm-password");
    }
  } catch (error) {
    console.error("Error during OTP verification:", error);
  
  }
};

  return (
    <div className="grid w-full min-h-screen grid-cols-2">
      <div className="bg-[#E5E4E0] flex flex-col items-center px-4 ">
        <h1 className="font-bold text-3xl mt-[100px]">
          Enter verification code
        </h1>
        <p className="w-[75%] my-[40px] text-[20px] text-center">
          Your 6-digit code has been sent to pi****@gmail.com. Check your email
          to continue.
        </p>
        <h2 className="text-[16px] font-semibold">
          Please enter the code you received
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between py-2 gap-4 my-[40px]">
            {otp.map((digit, index) => (
              <input
                key={index}
                className="w-12 h-12 text-xl text-center bg-white md:font-semibold"
                value={digit}
                ref={(element) => (inputRef.current[index] = element)}
                name="otp"
                maxLength={1}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <div className="flex justify-center w-full">
            <button
            type="submit"
            disabled={loading} 
            className={`rounded-full px-8 py-3 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#E5C1A9]"
            }`}
          >
            {loading ? "Sending..." : "Send OTP"} 
          </button>
          </div>
        </form>
      </div>

      <div className="flex justify-center items-center bg-[#E9EBF7]">
        <div className="h-[600px] flex justify-center items-center">
          <img
            src={ConfirmPasswordImage}
            className="object-contain w-full h-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
