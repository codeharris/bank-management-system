import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';

const TransferForm: React.FC = () => {
    const [fromOwnerId, setFromOwnerId] = useState('');
    const [toOwnerId, setToOwnerId] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const handleFromOwnerIdChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFromOwnerId(e.target.value);
    };

    const handleToOwnerIdChange = (e: ChangeEvent<HTMLInputElement>) => {
        setToOwnerId(e.target.value);
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTransfer = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!fromOwnerId || !toOwnerId || !amount) {
            setError('All fields are required.');
            return;
        }

        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            setError('Amount must be a positive number.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/transfers', {
                fromOwnerId,
                toOwnerId,
                amount: Number(amount),
            });

            setSuccessMessage(response.data.message);
            setOpen(true);
        } catch (error) {
            console.error('Error during transfer:', error);
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error || 'Transfer failed. Please try again.');
            } else {
                setError('Transfer failed due to an unexpected error.');
            }
        }
    };

    return (
        <>
            <div className='flex flex-col items-center mb-2'><h1>Transfer Details</h1></div>
            <form onSubmit={handleTransfer} className='border-black container w-2/4'>
                <TextField
                    label="From Owner ID"
                    value={fromOwnerId}
                    onChange={handleFromOwnerIdChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="To Owner ID"
                    value={toOwnerId}
                    onChange={handleToOwnerIdChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Amount"
                    value={amount}
                    onChange={handleAmountChange}
                    required
                    fullWidth
                    margin="normal"
                    type="number"
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <Button type="submit" variant="contained" color="primary" className='bg-green-600 capitalize text-lg cursor-pointer px-3 py-2 my-3'>
                    Transfer
                </Button>
            </form>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Transfer Successful</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The transfer was successful.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TransferForm;
