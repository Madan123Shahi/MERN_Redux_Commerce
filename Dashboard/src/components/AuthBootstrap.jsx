import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshAccessToken } from "../app/features/authSlice";

export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshAccessToken());
  }, [dispatch]);

  return children;
}
