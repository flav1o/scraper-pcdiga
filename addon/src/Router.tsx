import { useEffect, useMemo, useState } from "react";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  HomeView,
  OnboardingView,
  RecoverPassword,
  SignInView,
  SignUpView,
} from "./views";
import { useStorage } from "./hooks";
import { Routes as NavRoutes } from "./constants";
import { ConfirmationCode } from "./views/auth/confirmation-code/ConfirmationCode";
import { ProductDetailsView } from "./views/product-details/ProductDetails";

interface RouteConfig {
  path: string;
  element: React.ReactElement;
  isAccessible?: () => Promise<boolean>;
}

const DEFAULT_ROUTES: RouteConfig[] = [
  {
    path: NavRoutes.SignUp,
    element: <SignUpView />,
  },
  {
    path: NavRoutes.RecoverPassword,
    element: <RecoverPassword />,
  },
  {
    path: NavRoutes.ConfirmationCode,
    element: <ConfirmationCode />,
  },
];

export const Router = () => {
  const { getKey } = useStorage();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const basePath = chrome.storage ? "/index.html" : "/";

  const routeConfigs: RouteConfig[] = useMemo(
    () => [
      {
        path: NavRoutes.Onboarding,
        element: <OnboardingView />,
        isAccessible: async () => {
          const hasSkipped = await getKey("ONBOARDING");
          return !hasSkipped;
        },
      },
      {
        path: NavRoutes.SignIn,
        element: <SignInView />,
        isAccessible: async () => {
          const hasToken = await getKey("AUTH_TOKEN");
          const hasViewedOnboarding = await getKey("ONBOARDING");
          return Boolean(!hasToken || !hasViewedOnboarding);
        },
      },
      {
        path: NavRoutes.Home,
        element: <HomeView />,
        isAccessible: async () => {
          const hasToken = await getKey("AUTH_TOKEN");
          const hasViewedOnboarding = await getKey("ONBOARDING");
          return Boolean(hasToken && hasViewedOnboarding);
        },
      },
      {
        path: NavRoutes.ProductDetails,
        element: <ProductDetailsView />,
        isAccessible: async () => {
          const hasToken = await getKey("AUTH_TOKEN");
          const hasViewedOnboarding = await getKey("ONBOARDING");
          return Boolean(hasToken && hasViewedOnboarding);
        },
      },
      ...DEFAULT_ROUTES,
    ],
    [getKey]
  );

  useEffect(() => {
    const determineInitialRoute = async () => {
      for (const route of routeConfigs) {
        if (route.isAccessible && (await route.isAccessible())) {
          setInitialRoute(route.path);
          break;
        }
      }

      setIsLoading(false);
    };

    determineInitialRoute();
  }, [routeConfigs]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={basePath}
          element={
            <Navigate to={initialRoute ?? routeConfigs[0].path} replace />
          }
        />

        {routeConfigs.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        <Route
          path="*"
          element={
            <Navigate to={initialRoute ?? routeConfigs[0].path} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
