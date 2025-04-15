import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Imoveis } from './pages/Imoveis';
import ImovelForm from './pages/ImovelForm';
import { Login } from './pages/Login';
import { Users } from './pages/Users';

const PrivateRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ 
  children, 
  roles = ['admin', 'superuser'] 
}) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!localStorage.getItem('token');
  const hasRole = roles.includes(user.role);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/imoveis"
            element={
              <PrivateRoute>
                <Layout>
                  <Imoveis />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/imoveis/novo"
            element={
              <PrivateRoute>
                <Layout>
                  <ImovelForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/imoveis/editar/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <ImovelForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <PrivateRoute roles={['superuser']}>
                <Layout>
                  <Users />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 