import {useEffect,useState} from "react";import axios from "axios";import "./style.css";
const API=import.meta.env.VITE_API_URL||"http://localhost:5000/api";
// For a local classroom demo only: client-side keys are visible to users. Real apps should use server-side auth.
const API_KEY="change_this_local_demo_key";
export default function App(){const[tasks,setTasks]=useState([]),[title,setTitle]=useState(""),[loading,setLoading]=useState(true),[error,setError]=useState("");
async function load(){setLoading(true);setError("");try{const r=await fetch(`${API}/tasks`);const data=await r.json();if(!r.ok)throw new Error(data.error||`HTTP ${r.status}`);setTasks(data)}catch(e){setError(e.message||"Unable to load tasks")}finally{setLoading(false)}}
useEffect(()=>{load()},[]);
async function add(e){e.preventDefault();try{const r=await fetch(`${API}/tasks`,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY},body:JSON.stringify({title})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Request failed");setTasks(old=>[...old,d]);setTitle("");setError("")}catch(e){setError(e.message)}}
async function remove(id){try{const r=await fetch(`${API}/tasks/${id}`,{method:"DELETE",headers:{"x-api-key":API_KEY}});const d=await r.json();if(!r.ok)throw new Error(d.error||"Request failed");setTasks(old=>old.filter(t=>t.id!==id));setError("")}catch(e){setError(e.message)}}
async function loadAxios(){setLoading(true);try{const r=await axios.get(`${API}/tasks`);setTasks(r.data);setError("")}catch(e){setError(e.response?.data?.error||e.message)}finally{setLoading(false)}}
return <main><h1>Task Manager Mini App</h1><form onSubmit={add}><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="New task title" required/><button>Add task</button></form><button onClick={loadAxios}>Reload using Axios</button>{error&&<p className="error">{error}</p>}{loading?<p>Loading...</p>:<ul>{tasks.map(t=><li key={t.id}>{t.title} <button onClick={()=>remove(t.id)}>Delete</button></li>)}</ul>}</main>}
