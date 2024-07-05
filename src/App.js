import RoutesComponent from "./routes";
import "./styles/main.scss";
import Loader from "./components/common/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

function App() {
  return (
    <>
      <RoutesComponent />
      <ToastContainer
        icon={true}
        theme="colored"
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={true}
        closeButton={false}
        newestOnTop
      />
      <Loader />
    </>
  );
}

export default App;
