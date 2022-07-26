const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host:process.env.HOST,
			service: process.env.SERVICE,
			port: 587,
			secure: true,
			auth: {
				user:process.env.USER,
				pass:process.env.PASS,
			},
			tls:{
				rejectUnauthorized:false
			}
			});
		await transporter.sendMail({
			from:process.env.USER,
			to: email,
			subject: subject,
			html:`<link>${text}</link>`
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};