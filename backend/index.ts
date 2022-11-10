import express, { Response, response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
const FSDB = require("file-system-db");
require("dotenv").config();
import jwt from "jsonwebtoken"
const auth = require("./middleware/auth")

import fetch from 'node-fetch-commonjs';
import { AuthInfoRequest } from "./types/userRequest";


const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin:'http://localhost:4200'
}));
app.use(express.json());

const db = new FSDB("./user.json", false); 

// Login + register routes
app.post("/login",(req,res)=>{
    const {name, email, password} = req.body
    const user = db.get(email);
    if(user){
        if(password == user.password ){
            const token = jwt.sign(
                { user: name, email },
                    "TOKEN-KEY",
                {
                  expiresIn: "10h",
                }
              );
              // save user token
            return res.status(200).send({message:"Logged In", token})
        }else{
            return res.status(400).send({message:"Incorrect Password"})
        }
    }else{
        db.set(email,req.body)
        const token = jwt.sign(
            { user: name, email },
                "TOKEN-KEY",
            {
              expiresIn: "10h",
            }
          );
        return res.status(200).send({message:"Successfully Created User", token})
    }
})

// authenticated routed 
app.get("/movies/:query", auth, async (req:AuthInfoRequest,res:Response)=>{
    try{
        const user = db.get(req.user?.email);
        if(user){
            const url = `https://api.tvmaze.com/search/shows?q=${req.params.query}`
            
            const dataJson= await fetch(url)
            .then((response: { json: () => any; })=>response.json())
            .then((json: any) =>{
             return json})
            .catch((err: any)=> res.status(401).send(err)
            )
            
            return res.status(200).send(dataJson);
        }
        res.status(200).send({message:"Pease Login"})
    }catch(err){
        res.send(err)
    }
    
})

const port = process.env.PORT || 3000;


app.listen(port,()=>{
    console.log(`Listening on PORT ${port}`)
})