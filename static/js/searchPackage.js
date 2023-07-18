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

let count=0;
window.onload=()=>{
	count=0;
}

const handleSearch= async()=>{
	if(searchItem.value!==""){
		loadMoreBox.style.display="block";
	}
   let data=await myAJAX('GET',`/search?q=${searchItem.value}`);
   console.log(data);
   searchBox.innerHTML="";
   data.map((item)=>{
	searchBox.innerHTML+=createSearchPackage(item)
   })
}

const handleLoadMore=async()=>{
	count=count+1;
	let data=await myAJAX('GET',`/search?q=${searchItem.value}&count=${count}` );
	console.log(data);
	data.map((item)=>{
	 searchBox.innerHTML+=createSearchPackage(item)
	})
}