import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';


interface Account {
    id: number;
    ownerId: number;
    currency: string;
    balance: number;
}

interface Transfer {
    id: number;
    fromOwnerId: number;
    toOwnerId: number;
    amount: number;
    status: string;
}

const Home: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transfers, setTransfers] = useState<Transfer[]>([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/accounts');
                setAccounts(response.data);
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };

        const fetchTransfers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/transfers');
                setTransfers(response.data);
            } catch (error) {
                console.error('Error fetching transfers:', error);
            }
        };

        fetchAccounts();
        fetchTransfers();
    }, []);

    const totalAmountTransferred = transfers.reduce((acc, transfer) => acc + transfer.amount, 0);

    return (
        <div>

            <div className='flex mb-10 md:flex-row flex-col gap-5 m-5'>
                <Link to="/accounts" className='no-underline'><Card className='w-80 bg-green-800 text-white hover:translate-y-6'>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Total Accounts
                        </Typography>
                        <Typography variant="h6">
                            {accounts.length}
                        </Typography>
                    </CardContent>
                </Card></Link>

                <Card className='w-80 bg-blue-600 text-white'>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Total Amount Transferred
                        </Typography>
                        <Typography variant="h6">
                            {totalAmountTransferred}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
            <div className="heading m-5"><h3>Transfer History</h3></div>
            <TableContainer component={Paper} className='w-3/4 m-5'>
                <Table>
                    <TableHead className='bg-slate-50 '>
                        <TableRow >
                            <TableCell >From Owner ID</TableCell>
                            <TableCell >To Owner ID</TableCell>
                            <TableCell >Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transfers.map((transfer) => (
                            <TableRow key={transfer.id} className='odd:bg-white even:bg-slate-50'>
                                <TableCell>{transfer.fromOwnerId}</TableCell>
                                <TableCell>{transfer.toOwnerId}</TableCell>
                                <TableCell>{transfer.amount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Home;
