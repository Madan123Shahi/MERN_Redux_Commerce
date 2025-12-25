// In AuthBootstrap.jsx
export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(protectAdmin());
  }, [dispatch]);

  return children; // Remove the loading check here
}
