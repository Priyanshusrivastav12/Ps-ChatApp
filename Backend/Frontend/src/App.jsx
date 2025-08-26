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
import { getComponentClasses } from "./utils/theme";
import { Toaster } from "react-hot-toast";

import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  const [authUser, setAuthUser] = useAuth();
  const { isDark, currentTheme } = useTheme();
  const componentClasses = getComponentClasses(isDark);
  
  console.log(authUser);
  
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <div className={`drawer lg:drawer-open h-screen ${componentClasses.page}`}>
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
                  <div className={`min-h-full w-80 text-base-content relative ${componentClasses.sidebar}`}>
                    {/* Mobile close button - positioned to avoid overlap with hamburger */}
                    <div className="lg:hidden absolute top-2 right-2 z-30">
                      <label
                        htmlFor="my-drawer-2"
                        className={`btn btn-sm btn-circle btn-ghost ${
                          isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-900/10'
                        } transition-colors duration-200 shadow-lg`}
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
            background: isDark ? '#334155' : '#ffffff',
            color: isDark ? '#f8fafc' : '#0f172a',
            border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: isDark 
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
              : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          },
          success: {
            style: {
              background: isDark ? '#065f46' : '#d1fae5',
              color: isDark ? '#6ee7b7' : '#047857',
              border: isDark ? '1px solid #059669' : '1px solid #10b981'
            }
          },
          error: {
            style: {
              background: isDark ? '#7f1d1d' : '#fee2e2',
              color: isDark ? '#fca5a5' : '#dc2626',
              border: isDark ? '1px solid #dc2626' : '1px solid #ef4444'
            }
          }
        }}
      />
    </>
  );
}

export default App;
