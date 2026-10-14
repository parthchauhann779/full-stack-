require("dotenv").config();
const express=require("express"),cors=require("cors");
const app=express(),PORT=process.env.PORT||5000,API_KEY=process.env.API_KEY||"change_this_local_demo_key";
let tasks=[{id:1,title:"Read HTML notes",completed:false},{id:2,title:"Practice CSS",completed:false},{id:3,title:"Learn JavaScript",completed:true},{id:4,title:"Build a React component",completed:false},{id:5,title:"Test REST routes",completed:false}];
app.use(cors());app.use(express.json());
app.use((req,res,next)=>{console.log(`${req.method} ${req.originalUrl} ${new Date().toISOString()}`);next()});
function auth(req,res,next){if(req.get("x-api-key")!==API_KEY)return res.status(401).json({error:"Unauthorized: missing or invalid x-api-key"});next()}
app.get("/api/tasks",(req,res)=>res.json(tasks));
app.get("/api/tasks/:id",(req,res)=>{const task=tasks.find(t=>t.id===Number(req.params.id));if(!task)return res.status(404).json({error:"Task not found"});res.json(task)});
app.post("/api/tasks",auth,(req,res)=>{const title=String(req.body.title||"").trim();if(!title)return res.status(400).json({error:"title is required"});const task={id:tasks.length?Math.max(...tasks.map(t=>t.id))+1:1,title,completed:Boolean(req.body.completed)};tasks.push(task);res.status(201).json(task)});
app.put("/api/tasks/:id",auth,(req,res)=>{const task=tasks.find(t=>t.id===Number(req.params.id));if(!task)return res.status(404).json({error:"Task not found"});if(req.body.title!==undefined)task.title=String(req.body.title);if(req.body.completed!==undefined)task.completed=Boolean(req.body.completed);res.json(task)});
app.delete("/api/tasks/:id",auth,(req,res)=>{const index=tasks.findIndex(t=>t.id===Number(req.params.id));if(index<0)return res.status(404).json({error:"Task not found"});const [deleted]=tasks.splice(index,1);res.json({message:"Task deleted",task:deleted})});
app.use((req,res)=>res.status(404).json({error:"Route not found"}));
app.use((err,req,res,next)=>{console.error(err);res.status(err.status||500).json({error:err.message||"Internal server error"})});
app.listen(PORT,()=>console.log(`Task API running at http://localhost:${PORT}`));
