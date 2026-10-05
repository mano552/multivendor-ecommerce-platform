import { createContext, useContext, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import api from "../api/axios";

const StripeContext = createContext(null);

export const StripeProvider = ({ children }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    api.get("/config").then(({ data }) => {
      if (data.stripePublishableKey) {
        setStripePromise(loadStripe(data.stripePublishableKey));
      } else {
        setConfigured(false);
      }
    });
  }, []);

  return (
    <StripeContext.Provider value={{ stripePromise, configured }}>
      {children}
    </StripeContext.Provider>
  );
};

export const useStripeConfig = () => useContext(StripeContext);
