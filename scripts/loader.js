function fetchProducts() {
	// Send GET request to get json value

	$.ajax({
		type: "GET",
		url: "http://localhost:3000/api/da24dea7-d4ce-4e31-a531-96d6c466ea38",
		success: function (items) {
			/*
			{
				product_id: row.product_id,
				access_type: row.access_type
			}
			 */

			items.forEach((item) => {
				if (item.access_type === "user") {
					$("#products-container").append(`<div class="product-item">
						<h3>${item.product_name}</h3>
						<p>${item.description}</p>
						<div class="button accent">
							<a href="${item.learn_link}" target="_blank" tabindex="-1">Learn More</a>
						</div>
					</div>`);
				} else if (item.access_type === "admin" || item.access_type === "superadmin") {
					$("#products-container")
						.append(`<div id="${item.product_name}" class="product-item special-item">
						<h3>${item.description}</h3>
						<img src="assets/product-new-item-icon.svg" alt="${item.description} Icon">
					</div>`);
				}
			});
		},
		error: function (xhr, status, error) {
			// Handle error
			let errorCode = xhr.status;
			let errorText = xhr.statusText;
			let errorMessage = `<span><strong>Error ${errorCode}</strong>: ${errorText}</span>`;

			$("#new-product-error-wrapper").append(infoBox("error", errorMessage));
			$("#new-product-error-wrapper").show();
		},
	});
}

function fetchMembers() {
	// Send GET request to get json value

	$.ajax({
		type: "GET",
		url: "http://localhost:3000/api/2410fb2e-bd08-4678-be1b-c05ebb13a5c1",
		success: function (items) {
			/*
			{
				member_id: row.member_id,
				access_type: row.access_type,
			}
			 */

			items.forEach((item) => {
				if (item.access_type === "user") {
					$("#members-container").append(`<div class="team-member-item">
						<img src="${item.member_photo}" alt="${item.member_name} Picture">
						<div class="vertical-layout">
							<h3>${item.member_name}</h3>
							<p>${item.member_role}</p>
						</div>
					</div>`);
				} else if (item.access_type === "admin" || item.access_type === "superadmin") {
					$("#members-container")
						.append(`<div id="${item.member_name}" class="product-item special-item">
                        <h3>${item.member_role}</h3>
                        <img src="assets/product-new-item-icon.svg" alt="${item.member_role} Icon">
                    </div>`);
				}
			});
		},
		error: function (xhr, status, error) {
			// Handle error
			let errorCode = xhr.status;
			let errorText = xhr.statusText;
			let errorMessage = `<span><strong>Error ${errorCode}</strong>: ${errorText}</span>`;

			$("#new-product-error-wrapper").append(infoBox("error", errorMessage));
			$("#new-product-error-wrapper").show();
		},
	});
}

fetchProducts();
fetchMembers();
