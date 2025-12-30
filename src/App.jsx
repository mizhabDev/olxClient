
import BackgroundUI from "./components/BackgroundUI";
import { Outlet } from "react-router-dom";


function App() {
  return (
    <div className="relative min-h-screen">
      {/* Global background */}
      <BackgroundUI />

      {/* Pages go here */}
      <div className="relative z-10 min-h-screen">
        <Outlet />
      
          
        
      </div>
    </div>

    
  );
}

export default App;
