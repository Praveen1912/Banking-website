// requiring essentials(express,body-parser,mongoose,ejs)
const express=require('express')
const mongoose=require('mongoose')
const app=express()
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}))

//rendering static files(html,css,javascript)
app.use(express.static("public"));
app.set("view engine","ejs")

//connecting to database(spark)
mongoose.connect("mongodb://Localhost:27017/spark",{useNewUrlParser:true})
mongoose.set("useCreateIndex",true)

//schema to add transaction details in transactions collection
const addTransaction=new mongoose.Schema({

  SenderName:String,
  SenderId:String,
  ReceiverName:String,
  ReceiverId:String,
  Amount:Number,
  Status:String,

})
//transactions model
const TransactionDetail= new mongoose.model("transaction",addTransaction)


//Schema for fetching account details
const acccountDetail=new mongoose.Schema({
  Acct:String,
  Name:String,
  Balance:Number
})
//model for accounts collection
const AccountDetail= new mongoose.model("account",acccountDetail)

//get route for transfer amount
app.get("/transfer",function(req,res){
    res.render("transfer",{subhead:"hide",submssg:""})
  
  })

//post for transfer amount
app.post("/transfer",function(req,res){
  AccountDetail.find({Acct:req.body.senderId},function(err,result){
    AccountDetail.find({Acct:req.body.recepientId},function(err1,result2){
      if(result.lenght!=0 && result2.length!=0 && result[0].Balance>=req.body.transferAmt){
          var val=result[0].Balance-req.body.transferAmt
          AccountDetail.updateOne({Acct:req.body.senderId},{Balance:val},function(err,doc){})  //
          var val2=result2[0].Balance+Number(req.body.transferAmt)
          AccountDetail.updateOne({Acct:req.body.recepientId},{$set:{Balance:val2}},function(err,doc){})
          const var1=new TransactionDetail({
            SenderName:req.body.senderName,
            SenderId:req.body.senderId,
            ReceiverName:req.body.recepientName,
            ReceiverId:req.body.recepientId,
            Amount:req.body.transferAmt,
            Status:"Success"

          })
          var1.save();
          res.render("transfer",{subhead:"Success",submssg:"Transaction Success"})

      }
      else{

        const var1=new TransactionDetail({
          SenderName:req.body.senderName,
          SenderId:req.body.senderId,
          ReceiverName:req.body.recepientName,
          ReceiverId:req.body.recepientId,
          Amount:req.body.transferAmt,
          Status:"Failure"

        })
        var1.save();
        res.render("transfer",{subhead:"error",submssg:"Transaction Failure"})

      }
    })
  })


})

//get customer detail route
app.get("/getCust",function(req,res){
  var data=[]
  res.render("view_cust",{data:data,data2:data})
})

//to provide deatils for enquiry in get customer
app.post("/getCust",function(req,res){

  AccountDetail.find({Acct:req.body.custId},function(err,result){
  AccountDetail.find({Name:req.body.nameCust},function(err,result2){
    res.render("view_cust",{data:result,data2:result2})
  })
})
})

// to display details of all successful and failed transaction
app.get("/transaction",function(req,res){
  TransactionDetail.find({},function(err,result){
    res.render("transaction",{data:result})
  })

})
// to listen to client request
PORT=3000

app.listen(PORT,function(){
    console.log("running")
});