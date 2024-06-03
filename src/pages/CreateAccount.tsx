import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AccountForm from '../components/AccountForm';
import { AccountData } from '../types/AccountData';

const CreateAccount: React.FC = () => {
    const navigate = useNavigate();
    const [existingAccounts, setExistingAccounts] = useState<AccountData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get<AccountData[]>('http://localhost:5000/accounts')
            .then(response => {
                setExistingAccounts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching existing accounts:', error);
                setLoading(false);
            });
    }, []);

    const handleSubmit = (data: AccountData) => {
        axios.post('http://localhost:5000/accounts', data)
            .then(() => navigate('/accounts'))
            .catch(error => console.error('Error creating account:', error));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className='flex flex-col items-center mb-2'><h1>Create Account</h1></div>
            <AccountForm
                initialData={{ ownerId: '', currency: '', balance: 0 }}
                onSubmit={handleSubmit}
                existingAccounts={existingAccounts} // Pass existingAccounts here
            />
        </>
    );
};

export default CreateAccount;
