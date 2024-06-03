import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import AccountList from './components/AccountList';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';


describe('AccountList component', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.restore();
    });

    it('renders table with accounts data', async () => {
        const accountsData = [
            { id: 1, ownerId: 101, currency: 'USD', balance: 100 },
            { id: 2, ownerId: 102, currency: 'EUR', balance: 200 },
        ];

        mock.onGet('http://localhost:5000/accounts').reply(200, accountsData);

        render(<AccountList />);

        // Wait for accounts to be loaded
        await waitFor(() => {
            expect(screen.getByText('Owner ID')).toBeInTheDocument();
            expect(screen.getByText('Currency')).toBeInTheDocument();
            expect(screen.getByText('Balance')).toBeInTheDocument();
            expect(screen.getByText('101')).toBeInTheDocument();
            expect(screen.getByText('102')).toBeInTheDocument();
        });
    });

    it('deletes an account when delete button is clicked', async () => {
        const accountsData = [
            { id: 1, ownerId: 101, currency: 'USD', balance: 100 },
            { id: 2, ownerId: 102, currency: 'EUR', balance: 200 },
        ];

        mock.onGet('http://localhost:5000/accounts').reply(200, accountsData);
        mock.onDelete('http://localhost:5000/accounts/1').reply(200);

        render(<AccountList />);

        // Wait for accounts to be loaded
        await waitFor(() => {
            expect(screen.getByText('Owner ID')).toBeInTheDocument();
            expect(screen.getByText('Currency')).toBeInTheDocument();
            expect(screen.getByText('Balance')).toBeInTheDocument();
        });

        // Click delete button for the first account
        fireEvent.click(screen.getAllByText('Delete')[0]);

        // Confirm deletion
        fireEvent.click(screen.getByText('Yes'));

        // Wait for deletion confirmation modal to disappear
        await waitFor(() => {
            expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
        });

        // Check if success modal appears
        expect(screen.getByText('The account has been deleted successfully.')).toBeInTheDocument();
    });

    // Add more test cases as needed
});
