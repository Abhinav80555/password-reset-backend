const Token = require("../models/token");
const router = require("express").Router();



router.get('/:urlId/',function (req, res) {
    Token.findOne({ shortUrl: req.params.urlId},function(err,data){
        if (err) return res.status(400).send({ message: "Invalid link" });
      
        res.redirect(`${data.longUrl}/${data.token}/`)
    })
 
  
  })


  router.get('/:urlId/r',function (req, res) {
    Token.findOne({ shortUrl: req.params.urlId},function(err,data){
        if (err) return res.status(400).send({ message: "Invalid link" });
      
        res.redirect(`${data.longUrl}/${data.token}/`)
    })
 
  
  })

//   app.get('/:urlId', function (req, res) {
//     UrlModel.findOne({ shortUrl: req.params.urlId }, function (err, data) {
//         if (err) throw err;

//         UrlModel.findByIdAndUpdate({ _id: data.id }, { $inc: { clickCount: 1 } }, function (err, updatedData) {
//             if (err) throw err;
//             res.redirect(data.longUrl)
//         })


//     })
// })

  module.exports = router;