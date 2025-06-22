const express= require('express');
const app=express();
const PORT=3000   ;
 app.use((error,req, res, next) => {
    console.error(error.stack);
    res.status(error.stack || 500).json({error:{message:error.message || 'Internal error occur'}})
 })
 app.listen(PORT, ()=> {
    console.log(`App Listhening at http://localhost: ${PORT}`   )
 })