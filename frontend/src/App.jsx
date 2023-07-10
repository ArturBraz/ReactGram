
import "./App.css";
import { Router } from "./router";

//Hooks
import { useAuth } from "./hooks/useAuth";

//components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
  const {auth, loading} = useAuth()

  if(loading) {
    return <p>Carregando ...</p>
  }

  return (
    <>
      <div className="App">
        <Navbar />
        <div className="container">
          <Router />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
