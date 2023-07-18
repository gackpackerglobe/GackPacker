const sharp = require("sharp");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const multer = require("multer");
const multerS3 = require("multer-s3");



const s3 = new AWS.S3({
	accessKeyId: process.env.AWSKEY,
	secretAccessKey: process.env.AWSPASSWORD,
	region: 'ap-south-1'
});

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'geakpacker2', 
		contentType: multerS3.AUTO_CONTENT_TYPE,
		key: function (req, file, cb) {
			cb(null, Date.now().toString() + '-' + file.originalname)
		}
	})
})
const calculateImageDimensions = async (buffer) => {

	try {
		const image = sharp(buffer);
		const metadata = await image.metadata();
		const orientation = metadata.orientation || 1;
		let { width, height } = metadata;
		if (orientation >= 5 && orientation <= 8) {
			[width, height] = [height, width];
		}
		return [width, height];
	} catch (error) { 
		throw error;
	}
};
const compressAndOverwrite = async (req, res, next, imgquality, imgmaintaineRatio, imgheight, imgwidth, imgmaxWidth) => {

	if (req.file) {
		try {
			console.log(req.file);
			const fileData = await s3.getObject({ Bucket: 'geakpacker2', Key: req.file.key }).promise();
			console.log(fileData)
			const maxWidth = imgmaxWidth;
			let targetWidth = imgwidth, targetHeight = imgheight;
			if (imgmaintaineRatio) {
				const [originalWidth, originalHeight] = await calculateImageDimensions(fileData.Body);
				const originalAspectRatio = originalWidth / originalHeight;
				if (originalAspectRatio > 1) {
					targetWidth = maxWidth;
					targetHeight = Math.floor(maxWidth / originalAspectRatio);
				} else {
					targetHeight = maxWidth;
					targetWidth = Math.floor(maxWidth * originalAspectRatio);
				}
			}

			const compressedBuffer = await sharp(fileData.Body)
				.rotate()
				.resize(targetWidth, targetHeight)
				.jpeg({ quality: imgquality })
				.toBuffer();

			await s3.putObject({
				Bucket: 'geakpacker2',
				Key: req.file.key,
				Body: compressedBuffer,
				ContentType: req.file.contentType,
			}).promise();
		} catch (error) {
			console.log(process.env.AWSKEY)
			console.log(process.env.AWSPASSWORD)
			console.log(error);
		}
	}
	next();
};

module.exports = {
	upload, compressAndOverwrite
}