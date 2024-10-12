import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthContextProvider } from './user/context/authContext/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { ThemeContextProvider } from './user/context/ThemeContext'


const root = createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <ThemeContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ThemeContextProvider>
  </BrowserRouter>
)