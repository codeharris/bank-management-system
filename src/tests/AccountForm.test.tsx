import React from 'react';
import { render, screen, } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { AccountData } from '../types/AccountData';
import AccountForm from '../components/AccountForm';




describe('AccountForm', () => {
    const initialData: AccountData = {
        ownerId: '',
        currency: '',
        balance: 0,
    };

    const existingAccounts: AccountData[] = [
        { ownerId: '123', currency: 'USD', balance: 1000 },
    ];

    const onSubmit = jest.fn();

    test('renders form fields correctly', () => {
        render(<AccountForm initialData={initialData} onSubmit={onSubmit} existingAccounts={existingAccounts} />);

        expect(screen.getByLabelText(/Owner ID/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Currency/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Balance/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    test('handles input changes correctly', () => {
        render(<AccountForm initialData={initialData} onSubmit={onSubmit} existingAccounts={existingAccounts} />);

        const ownerIdInput = screen.getByLabelText(/Owner ID/i);
        const currencyInput = screen.getByLabelText(/Currency/i);
        const balanceInput = screen.getByLabelText(/Balance/i);

        userEvent.type(ownerIdInput, '456');
        userEvent.type(currencyInput, 'EUR');
        userEvent.type(balanceInput, '500');

        expect(ownerIdInput).toHaveValue('456');
        expect(currencyInput).toHaveValue('EUR');
        expect(balanceInput).toHaveValue(500);
    });

    test('shows validation error for non-numeric Owner ID', () => {
        render(<AccountForm initialData={initialData} onSubmit={onSubmit} existingAccounts={existingAccounts} />);

        const ownerIdInput = screen.getByLabelText(/Owner ID/i);
        userEvent.type(ownerIdInput, 'abc');

        expect(screen.getByText(/Owner ID must be numeric/i)).toBeInTheDocument();
    });

    test('shows validation error for non-numeric balance', () => {
        render(<AccountForm initialData={initialData} onSubmit={onSubmit} existingAccounts={existingAccounts} />);

        const balanceInput = screen.getByLabelText(/Balance/i);
        userEvent.type(balanceInput, 'abc');

        expect(screen.getByText(/Balance must be numeric/i)).toBeInTheDocument();
    });

    test('shows error when account with Owner ID already exists', () => {
        render(<AccountForm initialData={initialData} onSubmit={onSubmit} existingAccounts={existingAccounts} />);

        const ownerIdInput = screen.getByLabelText(/Owner ID/i);
        userEvent.type(ownerIdInput, '123');

        const submitButton = screen.getByRole('button', { name: /submit/i });
        userEvent.click(submitButton);

        expect(screen.getByText(/Account with this Owner ID already exists/i)).toBeInTheDocument();
    });

    test('calls onSubmit with form data when form is valid', () => {
        render(<AccountForm initialData={initialData} onSubmit={onSubmit} existingAccounts={existingAccounts} />);

        const ownerIdInput = screen.getByLabelText(/Owner ID/i);
        const currencyInput = screen.getByLabelText(/Currency/i);
        const balanceInput = screen.getByLabelText(/Balance/i);

        userEvent.type(ownerIdInput, '456');
        userEvent.type(currencyInput, 'EUR');
        userEvent.type(balanceInput, '500');

        const submitButton = screen.getByRole('button', { name: /submit/i });
        userEvent.click(submitButton);

        expect(onSubmit).toHaveBeenCalledWith({
            ownerId: '456',
            currency: 'EUR',
            balance: 500,
        });
    });
});
