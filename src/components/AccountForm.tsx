import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button } from '@mui/material';
import { AccountData } from '../types/AccountData';

interface AccountFormProps {
    initialData: AccountData;
    onSubmit: (data: AccountData) => void;
    existingAccounts: AccountData[];
}

const AccountForm: React.FC<AccountFormProps> = ({ initialData, onSubmit, existingAccounts }) => {
    const [formData, setFormData] = useState<AccountData>(initialData);
    const [errors, setErrors] = useState<{ ownerId?: string; balance?: string; accountExists?: string }>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Validate input values
        let newErrors = { ...errors };

        if (name === 'ownerId') {
            if (!/^\d*$/.test(value)) {
                newErrors.ownerId = 'Owner ID must be numeric';
            } else {
                delete newErrors.ownerId;
            }
        }

        if (name === 'balance') {
            if (!/^\d*\.?\d*$/.test(value)) {
                newErrors.balance = 'Balance must be numeric';
            } else {
                delete newErrors.balance;
            }
        }

        setErrors(newErrors);

        setFormData({
            ...formData,
            [name]: name === 'balance' ? (value === '' ? '' : parseFloat(value)) : value,
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if account already exists
        const accountExists = existingAccounts.some(account => account.ownerId === formData.ownerId);
        if (accountExists) {
            setErrors((prev) => ({ ...prev, accountExists: 'Account with this Owner ID already exists' }));
            return;
        } else {
            setErrors((prev) => ({ ...prev, accountExists: '' }));
        }

        if (!errors.ownerId && !errors.balance && !errors.accountExists) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border-black container w-2/4">
            <TextField
                label="Owner ID"
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                required
                error={!!errors.ownerId || !!errors.accountExists}
                helperText={errors.ownerId || errors.accountExists}
                className="flex flex-col mb-2"
            />
            <TextField
                label="Currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                required
                className="flex flex-col my-5"
            />
            <TextField
                label="Balance"
                name="balance"
                value={formData.balance.toString()}
                onChange={handleChange}
                required
                error={!!errors.balance}
                helperText={errors.balance}
                className="flex flex-col my-5"
            />
            <Button type="submit" variant="contained" className="bg-green-600 capitalize text-lg cursor-pointer px-2 py-2">
                Submit
            </Button>
        </form>
    );
};

export default AccountForm;
