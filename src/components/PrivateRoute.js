import React, { useContext } from "react";
import { AuthContext } from "../utils";
import { Redirect } from "@reach/router";

function ProvateRoute({ component: Component }) {
  const { authState } = useContext(AuthContext);
  console.log(authState)
  return authState ? (
    <Component></Component>
  ) : (
    <Redirect to="/login" noThrow></Redirect>
  );
}

export default ProvateRoute;
