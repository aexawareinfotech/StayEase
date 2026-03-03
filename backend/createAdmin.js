const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/stayease').then(async () => {
    const db = mongoose.connection.db;
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await db.collection('users').updateOne(
        { role: 'admin' },
        {
            $set: {
                name: 'Super Admin',
                email: 'admin@stayease.com',
                password: hashedPassword,
                role: 'admin'
            }
        },
        { upsert: true }
    );
    console.log('Admin password updated to admin123');
    process.exit(0);
}).catch(console.error);
