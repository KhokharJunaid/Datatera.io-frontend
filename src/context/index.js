import { AuthProvider } from "./auth";
import { ListProvider } from "./list";

const ContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <ListProvider>{children}</ListProvider>;
    </AuthProvider>
  );
};

export default ContextProvider;
