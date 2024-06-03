import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AccountData } from './types/AccountData';
import AccountForm from './components/AccountForm';



describe('AccountForm component', () => {
    const onSubmitMock = jest.fn();
    const initialData: AccountData = {
        ownerId: '123',
        currency: 'USD',
        balance: 100,
    };
    const existingAccounts: AccountData[] = [
        {
            ownerId: '456',
            currency: 'EUR',
            balance: 200,
        },
    ];

    it('renders correctly', () => {
        const { getByLabelText, getByText } = render(
            <AccountForm initialData={initialData} onSubmit={onSubmitMock} existingAccounts={existingAccounts} />
        );

        expect(getByLabelText('Owner ID')).toBeInTheDocument();
        expect(getByLabelText('Currency')).toBeInTheDocument();
        expect(getByLabelText('Balance')).toBeInTheDocument();
        expect(getByText('Submit')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
        const { getByLabelText, getByText } = render(
            <AccountForm initialData={initialData} onSubmit={onSubmitMock} existingAccounts={existingAccounts} />
        );

        fireEvent.change(getByLabelText('Owner ID'), { target: { value: '789' } });
        fireEvent.change(getByLabelText('Currency'), { target: { value: 'GBP' } });
        fireEvent.change(getByLabelText('Balance'), { target: { value: '300' } });

        fireEvent.click(getByText('Submit'));

        await waitFor(() => {
            expect(onSubmitMock).toHaveBeenCalledWith({
                ownerId: '789',
                currency: 'GBP',
                balance: 300,
            });
        });
    });

    it('displays error message for invalid ownerId', async () => {
        const { getByLabelText, getByText } = render(
            <AccountForm initialData={initialData} onSubmit={onSubmitMock} existingAccounts={existingAccounts} />
        );

        fireEvent.change(getByLabelText('Owner ID'), { target: { value: 'abc' } });

        fireEvent.click(getByText('Submit'));

        await waitFor(() => {
            expect(getByText('Owner ID must be numeric')).toBeInTheDocument();
        });
    });

    it('displays error message for existing account', async () => {
        const { getByLabelText, getByText } = render(
            <AccountForm initialData={initialData} onSubmit={onSubmitMock} existingAccounts={existingAccounts} />
        );

        fireEvent.change(getByLabelText('Owner ID'), { target: { value: '456' } });

        fireEvent.click(getByText('Submit'));

        await waitFor(() => {
            expect(getByText('Account with this Owner ID already exists')).toBeInTheDocument();
        });
    });
});
