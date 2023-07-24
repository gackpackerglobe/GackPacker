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

const featuredPackageFn = async () => {
	try {
		let featuredPackage = await myAJAX("GET", '/featuredPackage');
		if (featuredPackage.length == 0) featuredPackagediv.innerHTML = "No Packages to Show."
		else featuredPackagediv.innerHTML = ""
		featuredPackage.map(package => {
			featuredPackagediv.innerHTML += createPackage(package);
		})

	} catch (err) {
		console.log(err);
	}
}

window.onload = () => {
	featuredPackageFn();
}