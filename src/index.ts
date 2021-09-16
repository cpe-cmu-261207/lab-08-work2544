import express, { Request } from 'express'
import { type } from 'os';

const app = express()
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));
let id = 0;
type Task = {
  id: number;
  name: string;
  complete: boolean;
}
const tasks: Task[] = []
app.get('/me', (req, res) => {
  return res.status(200).json({ id: '630610759', name: 'latthaphol laohapiboonrattana' })
})
app.get('/todo', (req, res) => {

  // try to call /todo?q1=data1&q2data2
  // you can read query parameters with "req.query"
  if (req.query.order == "asc") {
    tasks.sort((a, b) => {
      var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
      if (nameA < nameB) //sort string ascending
        return -1;
      if (nameA > nameB)
        return 1;
      return 0; //default return value (no sorting)
    })
  }
  else if (req.query.order == "desc") {
    tasks.sort((a, b) => {
      var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
      if (nameA > nameB) //sort string ascending
        return -1;
      if (nameA < nameB)
        return 1;
      return 0; //default return value (no sorting)
    })
  }
  return res.json({ status: 'success', tasks })
})
app.post('/todo', (req, res) => {

  // try to call /todo?q1=data1&q2data2
  // you can read query parameters with "req.query"
  const newTask: Task = {
    id: id + 1,
    name: req.body.name,
    complete: req.body.complete
  }
  if (typeof (newTask.name) !== "string" || newTask.name === "" || typeof (newTask.complete) !== "boolean") {
    return res.status(400).json({ status: "failed", message: "Invalid input data" })
  }
  else {
    id += 1
    tasks.push(newTask)
    return res.status(200).json({ status: 'success', tasks })
  }
})
app.put('/todo/:id', (req, res) => {
  let Changeid = parseInt(req.params.id)
  console.log(Changeid)
  let changer = tasks.findIndex(x => x.id == Changeid)
  if (changer > -1) {
    tasks[changer].complete = !tasks[changer].complete
    return res.status(200).json({ status: "succes", tasks })
  }
  else {
    return res.status(404).json({ status: "failed", message: "Id is not found" })
  }
})
app.delete('/todo/delete/:id',(req,resp)=>{
  
  const id=parseInt(req.params.id)
  const deleter=tasks.findIndex(x=>x.id===id)
  if(deleter>-1)
  {
   tasks.splice(deleter,1)
  return resp.json({status:"succes",tasks})
  }
  else
  {
      return resp.status(400).json({status:"failed",message:"Id is not found"})
  }
})
//Heroku will set process.env.PORT to server port
//But if this code run locally, port will be 3000
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Server is running at port' + port)
}
)