const router=require("express").Router();
router.post("/login",function(req,res){
    console.log(req.body)
    const username=req.body.username
    const password=req.body.password
    const cntlr=require("../controller/auth");
    const loginstatus=cntlr.checkcredentials(username,password)
    if (loginstatus==true){
       res.json({ "message":"login success",
       "token":"oooooooooooooooo",
       "roles":cntlr.role})
       
        
    }else{
        res.send("login fail");
    }
})
router.get("/login",function(req,res){
    console.log(req.body)
    const username=req.body.username
   
    const password=req.body.password
    res.send("login failed");
    
})
router.post("/login3",function(req,res){
    console.log(req.body)
    const username=req.body.username
   
    const password=req.body.password
    if(username=="abc" && password==123)
    {

        res.send("login sucess");
    }
    else{
        res.send("login failed");
}
})
module.exports=router;
