const router = require("express").Router();
const { User, validate } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const{ ObjectId }= require ("mongodb");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		user = await new User({ ...req.body, password: hashPassword }).save();

		const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
			longUrl: `https://password-reset-task.herokuapp.com/api/users/${user.id}/verify`,
            shortUrl: generateUrl()
		}).save();
		// const url = `https://password-reset-task.herokuapp.com/api/users/${user.id}/verify/${token.token}/`;
        //  const tokenend=`/${token.token}/`;
		const url = `https://password-reset-task.herokuapp.com/s/${token.shortUrl}`
		await sendEmail(user.email, "Verify Email", url);
		
		res
			.status(201)
			.send({ message: "An Email sent to your account please verify" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/",async(req,res)=>{
	const result = await User.find({})
	result ? res.send(result) : res.status(404).send({ error: "not found" });

})

router.delete( "/:id", async function (req, res) {
	const { id } = req.params;
	const result = await User.deleteOne({ _id: ObjectId(id) });
  result.deletedCount > 0
    ? res.send(result)
    : res.status(404).send({ error: "not found" });

  });



router.get("/:id/verify/:token/", async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		await User.updateOne({ _id: user._id},{verified: true },{ $inc: { clickCountSignup: 1 }});
		await token.remove();


		
		res.redirect("https://fanciful-brioche-6c2005.netlify.app/login")

		// res.redirect("https://fanciful-brioche-6c2005.netlify.app/login")
		// res.status(200).send({ message: "Email verified successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});


function generateUrl() {
    var rndResult = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;

    for (var i = 0; i < 5; i++) {
        rndResult += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return rndResult
}


module.exports = router;