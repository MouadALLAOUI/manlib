import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './routes/routes';


function App() {
  return (
    <div className="App min-h-screen bg-green-50">

      <AppRoutes />

      <Toaster position='top-center' />
    </div>
  );
}

export default App;
