import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TransferForm from './components/TransferForm';
import CreateAccount from './pages/CreateAccount';
import AccountList from './components/AccountList';
import EditAccount from './pages/EditAccount';


// Define your routes
const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/create',
                element: <CreateAccount />,
            },
            {
                path: '/accounts',
                element: <AccountList />,
            },
            {
                path: '/edit/:ownerId',
                element: <EditAccount />,
            },
            {
                path: '/transfer',
                element: <TransferForm />,
            },
        ],
    },
]);

const App: React.FC = () => {
    return <RouterProvider router={router} />;
};

export default App;