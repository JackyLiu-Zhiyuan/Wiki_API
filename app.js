const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});
app.set("view engine", "ejs");

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article",articleSchema);

app.use(bodyParser.urlencoded({
  extended:true
}));

app.use(express.static("public"));

app.get("/articles", function(req,res){
  Article.find(function(err,itemsFound){
    if(!err){
      res.send(itemsFound);
    }
    else{
      res.send(err);
    }
  })
})

app.post("/articles",function(req,res){
  const article = new Article({
    title: req.body.title,
    content: req.body.content
  })
  article.save(function(err){
    if(!err){
      console.log("Successfully saved the entry");
    }
    else{
      console.log(err);
    }
  });
  console.log(article);
})


app.delete("/articles", function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      console.log("Successfully deleted items");
    }
    else{
      console.log(err);
    }
  })

})

app.route("/articles/:articleTitle")
.get(function(req,res){
  const articleTitle = req.params.articleTitle;
  Article.findOne({title: articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("No article is found.")
    }
  })
})
.put(function(req,res){
  Article.updateMany(
    {title:req.params.articleTitle},
    {content: "New Content"},
    // {overwrite: true},
    function(err, result){
      if(!err){
        res.send("Successfully updated article");
      }
      else{
        res.send(err);
      }
    }
  )
})
// .delete(function(req,res));
























app.listen(3000,function(){
  console.log("Server started on port 3000");
})
