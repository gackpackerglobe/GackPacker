const mongoose=require("mongoose");
const packageSchema = new mongoose.Schema(
  {
    desc:{
		type:String,
	},
	itiny:{
		type:String,
	},
	sdate:{
		type:Date,
	},
	edate:{
		type:Date,
	},
	inclusion:{
		type:String,
	},
	exclusion:{
		type:String,
	},
	images:{
		type:Array,
	},
	city:{
		type:String,
	},
	country:{
		type:String,
	},
	state:{
		type:String,
	},
	price:{
		type:Number,
	},
	featured:{
		type:Boolean,
	},
	placeName:{
		type:String,
	}
  },
  { timestamps: true }
);

module.exports= mongoose.model("Package", packageSchema);
