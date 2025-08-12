import React from "react";
import Left from "./home/Leftpart/Left";
import Right from "./home/Rightpart/Right";
import Signup from "./components/Signup";
import Login from "./components/Login";
import NotificationSystem from "./components/NotificationSystem";
import { useAuth } from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";

import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  const [authUser, setAuthUser] = useAuth();
  console.log(authUser);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <div className="drawer lg:drawer-open h-screen">
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
                  <div className="min-h-full w-80 bg-black text-base-content relative">
                    {/* Mobile close button */}
                    <div className="lg:hidden absolute top-4 right-4 z-10">
                      <label
                        htmlFor="my-drawer-2"
                        className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/10"
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
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <Signup />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
