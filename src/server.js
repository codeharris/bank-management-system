const express = require('express');
const fs = require('fs');
const app = express();
const port = 5000;

app.use(express.json());

const dbFilePath = './db.json';

const readDB = () => {
    return JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
};

const writeDB = (data) => {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

app.post('/transfers', (req, res) => {
    const { fromOwnerId, toOwnerId, amount } = req.body;

    if (!fromOwnerId || !toOwnerId || !amount) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const db = readDB();
    const fromAccount = db.accounts.find(account => account.ownerId === parseInt(fromOwnerId));
    const toAccount = db.accounts.find(account => account.ownerId === parseInt(toOwnerId));

    if (!fromAccount || !toAccount) {
        return res.status(404).json({ error: 'One or both of the owner IDs do not exist.' });
    }

    if (fromAccount.balance < Number(amount)) {
        return res.status(400).json({ error: 'Insufficient balance.' });
    }

    fromAccount.balance -= Number(amount);
    toAccount.balance += Number(amount);

    const transferRecord = {
        id: db.transfers.length + 1,
        fromOwnerId,
        toOwnerId,
        amount,
        timestamp: new Date().toISOString(),
        status: 'completed'
    };

    db.transfers.push(transferRecord);
    writeDB(db);

    res.json({ message: 'Transfer successful', transfer: transferRecord });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
