window.onload=async()=>{
	let packageId = location.href.split('?')[1].split('=')[1];
     let data=await myAJAX('GET',`/details/${packageId}`);
	  detailsBox.innerHTML='';
	//   console.log(data);
	data.map((item)=>{
		detailsBox.innerHTML+=createDetailPackge(item);
	})
	 
}


const myAJAX = (method, url, data) => {
	return new Promise((resolve, reject) => {
		try {
			let XML = new XMLHttpRequest();
			XML.open(method, url);
			XML.setRequestHeader('Content-Type', 'application/json');
			XML.onload = (e) => {
				let data = JSON.parse(e.target.response);
				resolve(data);
			}
			XML.onerror = (err) => {
				reject(err);
			}
			XML.send(JSON.stringify(data));
		} catch (err) {
			reject(err);
		}
	});
}
