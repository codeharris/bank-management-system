import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import { createMemoryHistory, MemoryHistory } from 'history';
import CreateAccount from '../pages/CreateAccount';


jest.mock('axios');


describe('CreateAccount', () => {
    it('renders correctly', async () => {
        const existingAccounts = [
            { ownerId: '1', currency: 'USD', balance: 100 },
            { ownerId: '2', currency: 'EUR', balance: 200 },
        ];

        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({
            data: existingAccounts,
        });

        const history = createMemoryHistory();
        const { getByText, getByLabelText } = render(
            <MemoryRouter> {/* Use MemoryRouter */}
                <CreateAccount />
            </MemoryRouter>
        );

        expect(getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(getByText('Create Account')).toBeInTheDocument();
            expect(getByLabelText('Owner ID')).toBeInTheDocument();
            expect(getByLabelText('Currency')).toBeInTheDocument();
            expect(getByLabelText('Balance')).toBeInTheDocument();
        });

        existingAccounts.forEach(account => {
            expect(getByText(account.ownerId)).toBeInTheDocument();
            expect(getByText(account.currency)).toBeInTheDocument();
            expect(getByText(account.balance.toString())).toBeInTheDocument();
        });
    });

    it('submits form with valid data', async () => {
        const mockNavigate = jest.fn();
        const history = createMemoryHistory();

        const { getByLabelText, getByText } = render(
            <MemoryRouter> {/* Use MemoryRouter */}
                <CreateAccount />
            </MemoryRouter>
        );

        fireEvent.change(getByLabelText('Owner ID'), { target: { value: '123' } });
        fireEvent.change(getByLabelText('Currency'), { target: { value: 'USD' } });
        fireEvent.change(getByLabelText('Balance'), { target: { value: '100' } });

        (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValueOnce({});
        history.push = mockNavigate;

        fireEvent.click(getByText('Submit'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/accounts', {
                ownerId: '123',
                currency: 'USD',
                balance: 100,
            });
            expect(mockNavigate).toHaveBeenCalledWith('/accounts');
        });
    });
});
