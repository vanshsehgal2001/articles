const express=require('express')
const mongoose=require('mongoose')

const app=express()

app.get('/',(req,res)=>{
    res.send('It works!!!!')
})

const port= 5000 || process.env.PORT

app.listen(port,()=>{
    console.log(`Server started at ${port}`)
})