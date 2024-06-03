import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';


interface Account {
    id: number;
    ownerId: number;
    currency: string;
    balance: number;
}

const AccountList: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [search, setSearch] = useState<string>('');
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [deleteAccountId, setDeleteAccountId] = useState<number | null>(null);
    const [successModal, setSuccessModal] = useState<boolean>(false);

    const fetchAccounts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/accounts');
            setAccounts(response.data);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch accounts');
        }
    };

    const handleDelete = async () => {
        if (deleteAccountId === null) return;
        try {
            await axios.delete(`http://localhost:5000/accounts/${deleteAccountId}`);
            fetchAccounts(); // Refresh the list
            setSuccessModal(true); // Show success modal
            setConfirmDelete(false); // Close confirmation modal
        } catch (error) {
            console.error(error);
            alert('Failed to delete account');
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const filteredAccounts = accounts.filter(account =>
        account.ownerId.toString().includes(search) ||
        account.currency.toLowerCase().includes(search.toLowerCase()) ||
        account.balance.toString().includes(search)
    );

    return (
        <>
            <TextField
                label="Search Owner ID"
                variant="outlined"
                className='w-2/4 flex mb-5'
                margin="normal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <TableContainer component={Paper} className=''>
                <Table>
                    <TableHead className='bg-slate-100'>
                        <TableRow>
                            <TableCell>Owner ID</TableCell>
                            <TableCell>Currency</TableCell>
                            <TableCell>Balance</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAccounts.map((account) => (
                            <TableRow key={account.id} className='odd:bg-white even:bg-slate-50'>
                                <TableCell>{account.ownerId}</TableCell>
                                <TableCell>{account.currency}</TableCell>
                                <TableCell>{account.balance}</TableCell>
                                <TableCell>
                                    <Link to={`/edit/${account.id}`}>
                                        <Button variant="contained" color="primary" className="mx-2">Edit</Button>
                                    </Link>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => {
                                            setDeleteAccountId(account.id);
                                            setConfirmDelete(true);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this account?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)} color="primary">No</Button>
                    <Button onClick={handleDelete} color="secondary">Yes</Button>
                </DialogActions>
            </Dialog>

            {/* Success Modal */}
            <Dialog
                open={successModal}
                onClose={() => setSuccessModal(false)}
            >
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The account has been deleted successfully.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSuccessModal(false)} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AccountList;
