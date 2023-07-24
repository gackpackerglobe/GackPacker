function calculateDaysAndNights(startDate, endDate) {
	console.log
	const start = new Date(startDate);
	const end = new Date(endDate);
	const timeDiff = end.getTime() - start.getTime();
	const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
	const nights = Math.ceil(days) - 1;

	return {
		days,
		nights
	};
}

function getFormattedDate(dateString) {
	const date = new Date(dateString);
	const day = date.getDate();
	const month = date.toLocaleString('default', { month: 'short' });
	const formattedDate = `${day} ${month}`;
	return formattedDate;
}


const createPackage = (data) => {
	let { days, nights } = calculateDaysAndNights(data.sdate, data.edate);
	return `<div class="col-lg-4 col-md-6 mb-4">
	<div class="package-item bg-white mb-2" style="cursor:pointer"  onclick="window.open('/details?packageId=${data._id}','_self')" >
		<img class="img-fluid" src="${data.featureImg}" alt="">
		<div class="p-4">
			<div class="d-flex justify-content-between mb-3">
				<small class="m-0"><i
						class="fa fa-map-marker-alt text-primary mr-2"></i>${data.country}</small>
				<small class="m-0"><i class="fa fa-light fa-clock text-primary mr-2"></i>${days}-days & ${nights}-nights</small>
			</div>
			<a class="h5 text-decoration-none" disabled>${data.placeName}</a>
			<div class="border-top mt-4 pt-4">
				<div class="d-flex justify-content-between">
					<h6 class="m-0"><i class="fa fa-calendar-alt text-primary mr-2"></i>${getFormattedDate(data.sdate)}-${getFormattedDate(data.edate)}
					<h5 class="m-0"><i class="fa fa-rupee-sign text-primary mr-2"></i>${data.price}</h5>
				</div>
			</div>
		</div>
	</div>
</div>`
}


const createSearchPackage = (data) => {
	let { days, nights } = calculateDaysAndNights(data.sdate, data.edate);
	return `
	<div class="col-lg-4 col-md-6 mb-4"  onclick="window.open('/details?packageId=${data._id}','_self')" >
		<div class="package-item bg-white mb-2">
			<img class="img-fluid" src=${data.frontImg} alt="">
			<div class="p-4">
				<div class="d-flex justify-content-between mb-3">
					<small class="m-0"><i
							class="fa fa-map-marker-alt text-primary mr-2"></i>${data.country}</small>
							<small class="m-0"><i class="fa fa-light fa-clock text-primary mr-2"></i>${days}-days & ${nights}-nights</small>
							<small class="m-0"><i class="fa fa-map-marker-alt text-primary mr-2"></i>${data.city}</small>
				</div>
				<a class="h5 text-decoration-none" href="">${data.placeName}</a>
				<div class="border-top mt-4 pt-4">
					<div class="d-flex justify-content-between">
					<h6 class="m-0"><i class="fa fa-calendar-alt text-primary mr-2"></i>${getFormattedDate(data.sdate)}-${getFormattedDate(data.edate)}
						</h6>
						<h5 class="m-0"><i class="fa fa-rupee-sign text-primary mr-2"></i>${data.price}</h5>
						</div>
				</div>
			</div>
		</div>
	</div>`
}

const createDetailPackge = (data) => { 
	console.log(data)
	let date1=getFormattedDate(data.sdate).split(" ")[0];
	let month1=getFormattedDate(data.sdate).split(" ")[1];
	let date2=getFormattedDate(data.edate).split(" ")[0];
	let month2=getFormattedDate(data.edate).split(" ")[1];
	return ` <div class="pb-3" >
	<div class="blog-item">
		<div class="position-relative">
			<img class="img-fluid w-100" src="${data.images[0]}" alt="">
			<div class="blog-date">
				<h6 class="font-weight-bold mb-n1">${date1}</h6>
				<small class="text-white text-uppercase">${month1}</small>
			</div>
			<div class="blog-date" style="top: 80px;">
				<h6 class="font-weight-bold mb-n1">${date2}</h6>
				<small class="text-white text-uppercase">${month2}</small>
			</div>
		</div>
	</div>
	<div class="bg-white mb-3" style="padding: 30px;">
		<div class="d-flex mb-3">
		<span class="text-primary text-uppercase text-decoration-none" ><i class="fa fa-map-marker-alt text-primary mr-2"></i>${data.city}</span>
		<span class="text-primary px-2">|</span>
		<span class="text-primary text-uppercase text-decoration-none" >${data.state}</span>
		<span class="text-primary px-2">|</span>
		<span class="text-primary text-uppercase text-decoration-none" >${data.country}</span> 
		<h5 class="m-0 my-price" style="position:absolute;right:35px"><i class="fa fa-rupee-sign text-primary mr-2" ></i>${data.price}</h5>
		</div>
		<h2 class="mb-3">Description:</h2>
		<p>${data.desc}</p>
		<h4 class="mb-3">Photos</h4>
		<div class="container-xxl py-5 destination">
			<div class="container"> 
				<div class="row g-3">
					<div class="col-lg-7 col-md-6">
						<div class="row g-3">
							<div class="col-lg-12 col-md-12 wow zoomIn" data-wow-delay="0.1s">
								<a class="position-relative d-block overflow-hidden" target="__blank" href="${data.images[4]}">
									<img class="img-fluid" style="    margin-bottom: 15px;" src="${data.images[4]||'img/nomore.png'}">
								</a>
							</div>
							<div class="col-lg-6 col-md-12 wow zoomIn" data-wow-delay="0.3s">
								<a class="position-relative d-block overflow-hidden" target="__blank" href="${data.images[1]}">
									<img class="img-fluid" src="${data.images[1]||'img/nomore.png'}">
	
								</a>
							</div>
							<div class="col-lg-6 col-md-12 wow zoomIn" data-wow-delay="0.5s">
								<a class="position-relative d-block overflow-hidden" target="__blank" href="${data.images[2]}"> 
									<img class="img-fluid" src="${data.images[2]||'img/nomore.png'}">
	
								</a>
							</div>
						</div>
					</div>
					<div class="col-lg-5 col-md-6 wow zoomIn" data-wow-delay="0.7s" style="min-height: 350px;">
						<a class="position-relative d-block h-100 overflow-hidden" target="__blank" href="${data.images[3]}"> 
								<img class="img-fluid position-absolute w-100 h-100" style="object-fit: cover;" src="${data.images[3]||'img/nomore.png'}">
						</a>
					</div>
				</div>
			</div>
		</div>
		<h2 class="mb-3">Inclustion</h2>
		<p>${data.inclusion}</p>
			<h2 class="mb-3">Exclusion</h2>
		<p>${data.exclusion}</p>
			<h2 class="mb-3">Initiny</h2>
		<p>${data.itiny}</p>
		 <a href="https://api.whatsapp.com/send?phone=70713 41203&text=Hello, I want to know about trips and plans for ${data.placeName}" target="_blank" class="btn btn-primary py-md-3 px-md-5 mt-2">Book Now</a>
	</div>
</div>`
}

