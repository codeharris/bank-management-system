import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AccountForm from '../components/AccountForm';
import { AccountData } from '../types/AccountData';

const EditAccount: React.FC = () => {
    const { ownerId } = useParams<{ ownerId: string }>();
    const navigate = useNavigate();
    const [initialAccountData, setInitialAccountData] = useState<AccountData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                const response = await axios.get<AccountData>(`http://localhost:5000/accounts/${ownerId}`);
                setInitialAccountData(response.data);
                setLoading(false);
            } catch (error) {
                setError('Account does not exist');
                setLoading(false);
            }
        };

        fetchAccountData();
    }, [ownerId]);

    const handleSubmit = (data: AccountData) => {
        axios.put(`http://localhost:5000/accounts/${ownerId}`, data)
            .then(() => navigate('/accounts', { state: { message: 'Account updated successfully' } }))
            .catch(error => console.error('Error updating account:', error));
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return initialAccountData ? (
        <>
            <div className='flex flex-col items-center  my-5'><h1>Edit Account</h1></div>
            <AccountForm
                initialData={initialAccountData}
                onSubmit={handleSubmit}
                existingAccounts={[]} // Pass existingAccounts here
            />
        </>
    ) : null;
};

export default EditAccount;
