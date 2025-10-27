import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "../auth/auth";

export default function SignOut() {
  const nav = useNavigate();
  useEffect(() => {
    signOut();
    nav("/signin", { replace: true });
  }, [nav]);
  return null;
}
