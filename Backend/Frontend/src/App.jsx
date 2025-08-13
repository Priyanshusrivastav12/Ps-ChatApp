import React from "react";
import Left from "./home/Leftpart/Left";
import Right from "./home/Rightpart/Right";
import Signup from "./components/Signup";
import Login from "./components/Login";
import LoginEnhanced from "./components/LoginEnhanced"; // Enhanced login component
import LoginComparison from "./components/LoginComparison"; // Comparison component
import NotificationSystem from "./components/NotificationSystem";
import { useAuth } from "./context/AuthProvider";
import { useTheme } from "./context/ThemeProvider";
import { Toaster } from "react-hot-toast";

import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  const [authUser, setAuthUser] = useAuth();
  const { isDark } = useTheme();
  console.log(authUser);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <div className={`drawer lg:drawer-open h-screen transition-colors duration-200 ${
                isDark ? 'bg-gray-900' : 'bg-gray-100'
              }`}>
                <input
                  id="my-drawer-2"
                  name="drawer-toggle"
                  type="checkbox"
                  className="drawer-toggle"
                />
                
                {/* Main content area */}
                <div className="drawer-content flex flex-col h-screen overflow-hidden">
                  <Right />
                </div>
                
                {/* Sidebar */}
                <div className="drawer-side z-50">
                  <label
                    htmlFor="my-drawer-2"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                  ></label>
                  <div className={`min-h-full w-80 text-base-content relative transition-colors duration-200 ${
                    isDark ? 'bg-slate-900' : 'bg-white'
                  }`}>
                    {/* Mobile close button - moved to top-left to avoid overlap with settings */}
                    <div className="lg:hidden absolute top-4 left-4 z-20">
                      <label
                        htmlFor="my-drawer-2"
                        className={`btn btn-sm btn-circle btn-ghost transition-colors duration-200 ${
                          isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-900/10'
                        }`}
                      >
                        ✕
                      </label>
                    </div>
                    <Left />
                  </div>
                </div>
                
                {/* Notification System */}
                <NotificationSystem />
              </div>
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/login-enhanced"
          element={authUser ? <Navigate to="/" /> : <LoginEnhanced />}
        />
        <Route
          path="/compare"
          element={<LoginComparison />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <Signup />}
        />
      </Routes>
      <Toaster 
        toastOptions={{
          className: isDark ? 'dark' : '',
          style: {
            background: isDark ? '#374151' : '#ffffff',
            color: isDark ? '#f9fafb' : '#111827',
          },
        }}
      />
    </>
  );
}

export default App;
