const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const _ = require("lodash");
mongoose.set("strictQuery",true);
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.connect("mongodb+srv://sourabhchoudhary:<password>@cluster0.hch1sgl.mongodb.net/todoList",{useNewUrlParser:true});
const todolistSchema = new mongoose.Schema({
  todo:String,
});
const listSchema = new mongoose.Schema({
  name:String,
  items:[todolistSchema],
});
const Todo = mongoose.model("Todo",todolistSchema);
const List = mongoose.model("List",listSchema);
const todo1 = new Todo({
  todo:"Welcome to your Todo List!!",
});
const todo2 = new Todo({
  todo:"Write your Todo upside and press the + button to add!!",
});
const todo3 = new Todo({
  todo:"<-- Check this box to delete a todo!!",
});
const todo4 = new Todo({
  todo:"To create your custom Todo just add "/name-of-todolist" in the url!!",
});
const options = {
  weekday: "long",
  day: "numeric",
  month: "numeric",
};
var day = new Date().toLocaleDateString("en-US", options);
app.get("/", function (req, res) {
  Todo.find(function(err,todos){
    if(err){
      console.log(err);
    }else{
      if(todos.length==0){
        Todo.insertMany([todo1,todo2,todo3,todo4],function(err){
          if(err){
            console.log(err);
          }
          else{
            console.log("Successfully Inserted!!");
          }
        });
        res.redirect("/")
      }
      else{
        res.render("weekday", { dayOfWeek: day, newItem: todos });
      }
    }
  });
});
app.post("/", function (req, res) {
  const todo = new Todo({
    todo:req.body.todoinput,
  })
  if(req.body.submitButton===day){
    todo.save();
    res.redirect("/");
  }
  else{
    List.findOne({name:req.body.submitButton},function(err,list){
      if(err){
        console.log(err);
      }
      else{
        list.items.push(todo);
        list.save();
        res.redirect("/"+req.body.submitButton);
      }
    });
  }
});
app.post("/delete",function(req,res){
  if(req.body.checkbox2===day){
    Todo.findByIdAndRemove(req.body.checkbox,function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Removed Successfully");
      }
      res.redirect("/");
    });
  }
  else{
    List.findOneAndUpdate({name:req.body.checkbox2},{$pull:{items:{_id:req.body.checkbox}}},function(err,gotList){
      if(!err){
        console.log(gotList);
        res.redirect("/"+req.body.checkbox2);
      }
    });
  }
});
app.get("/:type",function(req,res){
List.findOne({name:_.capitalize(req.params.type)},function(err,list){
  if(err){
    console.log(err);
  }
  else{
    if(!list){
      const list = new List({
        name:_.capitalize(req.params.type),
        items:[todo1,todo2,todo3,todo4],
      });
      list.save();
      res.redirect("/"+_.capitalize(req.params.type));
    }
    else{
      res.render("weekday",{dayOfWeek:_.capitalize(req.params.type), newItem: list.items});
    }
  }
});});
app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
