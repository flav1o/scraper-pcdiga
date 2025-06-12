import React, { useEffect, useMemo } from "react";

import { Router } from "./Router";
import { TooltipProvider } from "./components/ui/tooltip";
import { GraphqlClientConfig } from "./config/graphql-client";
import { ApolloProvider } from "@apollo/client";
import { Toaster } from "./components/ui/sonner";
import "./config/i18n";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_OAUTH_ID } from "./config/google-oath";
import { useAppDispatch, useAppSelector } from "./store";
import { setAuthToken } from "./store/slices/user-slice";
import { useStorage } from "./hooks";

const App = () => {
  const { getKey } = useStorage();
  const dispatch = useAppDispatch();
  const { authToken } = useAppSelector((state) => state.user);

  const apolloClient = useMemo(() => GraphqlClientConfig(authToken), [
    authToken,
  ]);

  useEffect(() => {
    (async () => {
      const storedToken = await getKey("AUTH_TOKEN");
      if (storedToken) dispatch(setAuthToken(storedToken));
    })();
  }, [dispatch, getKey]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_ID}>
      <ApolloProvider client={apolloClient}>
        <TooltipProvider>
          <Router />
          <Toaster
            closeButton
            theme="light"
            toastOptions={{
              duration: 40000,
            }}
          />
        </TooltipProvider>
      </ApolloProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
