import logo from "./logo.svg";
import "./App.css";
import Vote from "./components/Vote";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Vote />
    <ToastContainer />

    </div>
  );
}

export default App;
