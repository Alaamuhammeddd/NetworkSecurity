import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { getAuthUser } from "../helper/storage";

const Admin = () => {
  const auth = getAuthUser();
  return (
    <>
      {auth && auth.user.type === "admin" ? <Outlet /> : <Navigate to={"/"} />}
    </>
  );
};
// nanigate to admin home

export default Admin;
