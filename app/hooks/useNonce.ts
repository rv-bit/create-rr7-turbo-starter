import { createContext, useContext } from "react";

export const NonceContext = createContext<string>("");
export const NonceProvider = NonceContext.Provider;

const useNonce = () => useContext(NonceContext);

export default useNonce;