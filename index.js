const express = require('express');
const app = express();
const {verifyUser,checkValidToken} = require('./controller/verifyUser')
const {connectDb}=require('./models/index');
const PORT=process.env.PORT||8009;
app.use(express.json())
app.post('/api/newuser',verifyUser);
app.post('/api/validity',checkValidToken);
app.listen(PORT,()=>{
    connectDb();
    console.log('listening on port '+PORT);
});