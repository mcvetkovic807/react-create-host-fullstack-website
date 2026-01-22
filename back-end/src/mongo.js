use testdb;

db.users.insertOne({
    email: "test@example.com",
    createdAt: new Date()
});

db.users.find().pretty();
