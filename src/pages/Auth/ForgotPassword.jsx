// import React, { useState } from "react";
// import axios from "axios";
// import { Snackbar } from "@mui/material";
// import MuiAlert from "@mui/material/Alert";
// import LoaddingSpinner from "../../components/tools/LoaddingSpinner";
// import PrideImage1 from "../../assets/images/PrideImage1.jpg";
// import backendURL from "../../config";

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");

//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setOpenSnackbar(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post(`${backendURL}/api/forgot-password`, {
//         email,
//       });
//       setMessage(response.data.message);
//       setSnackbarSeverity("success");
//       setEmail("");
//     } catch (error) {
//       setMessage(error.response?.data?.message || "An error occurred");
//       setSnackbarSeverity("error");
//     } finally {
//       setLoading(false);
//       setOpenSnackbar(true);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
//         <div className="text-center">
//           <div className="text-center">
//             <img src={PrideImage1} alt="Autograph Logo" />

//             <p className="mt-2  font-bold text-lg text-gray-600">
//               Forgot Password?
//             </p>
//           </div>
//           <p className="mt-2 text-sm text-gray-600">
//             Enter your email to reset your password
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//           <div className="space-y-4">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700">
//                 Your Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 required
//                 className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour sm:text-sm"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#1e293b] to-btColour hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out">
//               {loading ? <LoaddingSpinner /> : "Reset Password"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}>
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbarSeverity}
//           sx={{ width: "100%" }}>
//           {message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default ForgotPassword;
import React, { useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";
import PrideImage1 from "../../assets/images/PrideImage1.jpg";
import backendURL from "../../config";
import { Alert, AlertDescription } from "../../components/tools/Alert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${backendURL}/api/forgot-password`, {
        email,
      });
      showAlertMessage(
        response.data.message || "Reset link sent to your email!",
        "success"
      );
      setEmail("");
    } catch (error) {
      showAlertMessage(
        error.response?.data?.message ||
          "An error occurred while sending reset link",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xl transform transition-all duration-300">
        <div className="text-center space-y-2">
          <img
            src={PrideImage1}
            alt="Autograph Logo"
            className="mx-auto h-32 w-auto object-contain"
          />
          <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="text-gray-600">
            Enter your email to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700">
                Your Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  className={`w-full px-3 py-3 pl-10 border ${
                    isLoading
                      ? "border-gray-300 bg-gray-100"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400 disabled:cursor-not-allowed`}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {showAlert && (
          <Alert
            variant={alertConfig.variant}
            show={showAlert}
            onClose={() => setShowAlert(false)}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
            <AlertDescription>{alertConfig.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
