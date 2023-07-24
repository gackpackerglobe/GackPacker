function load_img() {
	photos_input.click();
}

let imageArray = [];

const handleChange = async () => {
	svgIcon.innerHTML = `<svg class="loading_icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
	<path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
	<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
	</svg>`
	let photo = photos_input.files[0];
	data = await uploadImage(photo);
	imageArray.push(data.location);
	if (imageArray.length >= 5) {
		svgIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16"
  height="16" fill="currentColor" class="bi bi-file-earmark-plus"
  viewBox="0 0 16 16">
  <path
	  d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z" />
  <path
	  d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
</svg>`
	} else {

		svgIcon.innerHTML = `<svg onclick="load_img()" xmlns="http://www.w3.org/2000/svg" width="16"
		height="16" fill="currentColor" class="bi bi-file-earmark-plus"
		viewBox="0 0 16 16">
		<path
		d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z" />
		<path
		d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
		</svg>`
	}
	document.getElementsByClassName('images')[0].innerHTML += `<div class="img"><img src='${data.location}' alt="" srcset=""></div>`
}
photos_input.addEventListener('change', async () => {
	handleChange();
})



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


window.onload = () => {
	getCountries();
}

let selectedCountry = { value: '', name: '' }, selectedState = { value: '', name: '' }, seletecCity = { value: '', name: '' };

const getCountries = async () => {
	let countriesData = await myAJAX('POST', '/fetchApis', {
		url: 'http://battuta.medunes.net/api/country/all/?key=00000000000000000000000000000000'
	})

	countriesData.forEach(country => {
		countries.innerHTML += `<option value="${country.code}">${country.name}</option>`
	})
	countries.addEventListener('change', async (e) => {
		selectedCountry.value = e.target.value;
		selectedCountry.name = parseName(countries, e);
		//console.log(parseName(countries, e))
		//console.log(selectedCountry.name)
		let stateData = await myAJAX('POST', '/fetchAPis', {
			url: `http://battuta.medunes.net/api/region/${selectedCountry.value}/all/?key=00000000000000000000000000000000`

		})
		stateData = stateData.map(state => {
			return {
				...state,
				'name': parseStateName(state.region)
			}
		})
		stateData.forEach(state => {
			states.innerHTML += `<option value="${state.region}">${state.name}</option>`
		})
	})
	states.addEventListener('change', async (e) => {
		selectedState.value = e.target.value;
		selectedState.name = parseName(states, e);
		let citydata = await myAJAX('POST', '/fetchAPis', {
			url: `https://battuta.medunes.net/api/city/${selectedCountry.value}/search/?region=${selectedState.value}&key=00000000000000000000000000000000`
		})
		citydata.forEach(city => {
			cities.innerHTML += `<option value="${city.city}">${city.city}</option>`
		})
	})
	cities.addEventListener('change', (e) => {
		seletecCity.value = e.target.value;
		seletecCity.name = parseName(cities, e);
	})
}

const parseStateName = (stateName) => {
	stateName = stateName.split('of ');
	if (stateName.length == 1) return stateName[0];
	else return stateName[1];
}

const parseName = (ele, event) => {
	let name = '';
	Array.from(ele.options).forEach(e => {
		if (e.value === event.target.value) {
			//console.log(e.innerText)
			name = e.innerText;
		}
	});
	return name;
}


const uploadImage = (file) => {
	return new Promise((Resolve, Reject) => {
		let formdata = new FormData();
		formdata.append("file", file);
		fetch("/uploadImage", {
			method: "POST",
			body: formdata,
		})
			.then((response) => response.json())
			.then((data) => {
				Resolve(data);
			})
			.catch((error) => {
				Reject(error);
			});
	})
};






addPackageForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	let data = {
		placeName: addPackageForm.placeName.value,
		price: addPackageForm.price.value,
		itiny: addPackageForm.itiny.value,
		inclusion: addPackageForm.inclusion.value,
		exclusion: addPackageForm.exclusion.value,
		desc: addPackageForm.desc.value,
		sdate: addPackageForm.sdate.value,
		edate: addPackageForm.edate.value,
		country: selectedCountry.name,
		state: selectedState.name,
		city: seletecCity.name,
		images: imageArray,
		featured: addPackageForm.featured.checked,
	}

	let result = await myAJAX("POST", '/addPackage', { data });
	if (result.success) window.location.replace('/')
	else {
		document.getElementsByClassName('error')[0].style.display = 'block'
	}

})