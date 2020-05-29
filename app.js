var express             = require('express'),
    methodOverride      = require('method-override'),
    app                 = express(),
    bodyParser          = require('body-parser');
    expressSanitizer    = require('express-sanitizer');
    mongoose            = require('mongoose');

mongoose.connect("mongodb://localhost/restfulBlog",{ useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false});
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//schema 
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created : {type:Date , default:Date.now()}
});
var Blog = mongoose.model("Blog",blogSchema);

//==============Restful routes===================
app.get('/',function(req,res){
    res.redirect('/blogs');
})
//index page
app.get('/blogs',function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    })
});

app.post('/blogs',function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //create a blog then redirect
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render('new');
        } else{
            res.redirect('/blogs');
        }
    })
})

//new route
app.get('/blogs/new',function(req,res){
    res.render("new");
});

//show 
app.get('/blogs/:id',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect('/blogs');
        } else{
            res.render('show',{blog:foundBlog});
        }
    });
})

//edit
app.get('/blogs/:id/edit',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect('/blogs');
        } else{
            res.render('edit',{blog:foundBlog});
        }
    });
});

//UPdate
app.put('/blogs/:id',function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err,updatedUser){
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs'+req.params.id);
        }
    });
});

//delete
app.delete('/blogs/:id',function(req,res){
    //destroy blog 
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect('/blogs')
        }else{
            res.redirect('/blogs'); 
        }
    })
    //redirect somewhere
});
var server = app.listen(3000,function(req,res){
    console.log("server has started........");
});