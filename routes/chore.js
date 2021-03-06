const router = require("express").Router();
const path = require("path");
const db = require("../models");


router.route("/api/login/:username/:password/:type").get((req,res)=>{ 
  console.log("\n username :"+req.params.username+"\n password :"+req.params.password+"\n type :"+req.params.type)
  if(req.params.type==="parent")
  {
   db.Parent.findOne({
            where:{
                ParentUsername:req.params.username,
                ParentPassword: req.params.password
            }
        }).then(function(result) {
            console.log("parent");
           // res.json(result);
             res.redirect("/parent");
        });
  }
  if(req.params.type==="child")
  {
   db.Child.findOne({
            where:{
                ChildUsername:req.params.username,
                ChildPassword: req.params.password
            }
        }).then(function(result) {
            console.log("child found");
           // res.json(result);
             res.redirect("/childpage");
        });
  }
  
});

router.route("/api/signUp").post((req,res)=>{ 
  console.log(req.body);
  const pare={
    ParentFirstName: req.body.firstname,
    ParentLastName:req.body.lastname ,
    ParentEmail:req.body.email,
    ParentUsername: req.body.username,
    ParentPassword: req.body.password,
  }
  console.log(pare);
  db.Parent.create(pare).then(function(result) {
    console.log("parent created");
    res.json(result);
  });
});

router.route("/api/childsignup").get((req,res)=>{ 
  console.log(req.body);
  const ch={
    ChildName: req.body.parentFirstName,
    ChildUsername: req.body.parentUserName,
    ChildPassword: req.body.parentPassword,
    ChildPointsEarned:0,
  }
  db.Child.create(ch).then(function(result) {
    console.log("child created");
    res.json(result);
  });
});

// add task
router.route("/api/addtask").post((req,res)=>{ 
  console.log(req.body);
  const tsk={
    ParentId:req.body.parentid,
    ChildId:req.body.childId,
    TaskName: req.body.taskname,
    TaskDescription: req.body.taskdescription,
    TaskPoints: req.body.taskpoints,
    StartDate: req.body.startdate,
    TaskType: req.body.tasktype,
    Mandatory: req.body.mandatory,
  }
  db.Tasks.create(tsk).then(function(result) {
    console.log("task created");
    // res.json(result);
    db.Tasks.findAll({
      where:{
        ParentId:parenttid,
      }
      }).then(function(result) {
        console.log(result);
        res.json(result);
        // res.redirect("/childpage");
      });
  });
});

// add rewards
router.route("/api/addreward").post((req,res)=>{ 
  console.log(req.body);
  const rwrd={
    ParentId:req.body.parentid,
    RewardName: req.body.rewardname,
        RewardsDescription:req.body.rewarddescription,
        RewardPoints: req.body.rewardpoints,
  }
  db.Rewards.create(rwrd).then(function(result) {
    console.log("reward created");
    db.Rewards.findAll({
      where:{
        ParentId:parenttid,
      }
      }).then(function(result) {
        console.log(result);
        res.json(result);
      });
  });
});

// pull up all the task per child per day.
router.route("/api/gettasks/:childid/").get((req,res)=>{ 
  console.log(req.params.childid);
   db.Tasks.findAll({
      where:{
        ChildId:req.params.childid,
      }
      }).then(function(result) {
        console.log(result);
        res.json(result);
        // res.redirect("/childpage");
      });
});
// pull up all the rewards.
router.route("/api/getreward/:childid").get((req,res)=>{ 
  db.Child.findOne({
            where:{
                ChildId:req.params.childid,
            }
        }).then(function(result) {
          var parid=result.ParentId;
          db.Rewards.findAll({
            where:{
              ParentId:parid,
            }
           }).then(function(result) {
              console.log(result);
              res.json(result);
            });
        });
});

// list of all kids
router.route("/api/childlist/:parentid").get((req,res)=>{ 
  db.Child.findAll({
    where:{
        ParentId:req.params.parentid,
        }
    }).then(function(result) {
        res.json(result);
      });
});


//*******************************************************************************/
//tasks for each child each day
router.route("/api/gettasks/:childid/:day").get((req,res)=>{ 
  console.log(req.params.childid);
   db.Tasks.findAll({
      where:{
        ChildId:req.params.childid,
      }
      }).then(function(result) {
        console.log(result);
        res.json(result);
        // res.redirect("/childpage");
      });
});

//set points for child
  //set credit to 1 if you are adding points for the child, 0 if the points are being reduced
router.route("/api/setpoints/:childid/:points:/:credit").get((req,res)=>{ 
  db.query(`call setChildPoints(:childid, :points, :credit)`, {
    replacements: {
      child: req.params.childid,
      points: req.params.points,
      credit: req.params.credit
    }
  })
  .then(function(results){
    console.log("points updated")
    console.log(results);
  })
  
});



// If no API routes are hit, send the React app
router.use(function(req, res) {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });

<<<<<<< HEAD
  module.exports = router;
=======
  module.exports = router;



>>>>>>> d949cbfeb4971a40aa42f1bdf7ca4353cfc9e393
