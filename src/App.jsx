import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routes from "./routes";
import { SnackbarProvider } from "notistack";
import { AuthConsumer, AuthProvider } from "./contexts/jwt-context";
import SplashScreen from "./components/SplashScreen";
import { registerLicense } from "@syncfusion/ej2-base";

function App() {
  const queryClient = new QueryClient();
  // Registering Syncfusion license key
  const key = import.meta.env.VITE_LICENSE_KEY;
  registerLicense(key);
  return (
    <Provider store={store}>
      <AuthProvider>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider maxSnack={3}>
              <AuthConsumer>
                {(auth) =>
                  !auth.isInitialized ? <SplashScreen /> : <Routes />
                }
              </AuthConsumer>
            </SnackbarProvider>
          </QueryClientProvider>
        </PersistGate>
      </AuthProvider>
    </Provider>
  );
}

export default App;
