import { Outlet, Route, Navigate } from "react-router-dom";
import React from "react";
import Login from "./DemoLogin";
import Messenger from "./Messenger";

// need to specify outlet here, not the name of the component (Messenger) otherwise
// props don't pass.
export default function ProtectedRoutes(props) {
  return props.user ? <Outlet /> : <Navigate to="/" />;
}
