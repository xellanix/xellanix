// Function to make an AJAX request with proper handling of asynchronous token retrieval
function ajaxRequest(headers = {}, options) {
	try {
		if (Object.keys(headers).length > 0) {
			if (!options.headers) {
				options.headers = {};
			}

			Object.assign(options.headers, headers);
		}

		// Perform the AJAX request
		return $.ajax(options);
	} catch (error) {
		console.error("Ajax request failed:", error);
		return $.Deferred().reject(error).promise();
	}
}

async function refreshToken() {
	const refreshToken = localStorage.getItem("refreshToken");
	if (!refreshToken) return;

	const jx = new Promise((resolve, reject) => {
		ajaxRequest(
			{
				Authorization: `Bearer ${refreshToken}`,
			},
			{
				type: "GET",
				url: `http://localhost:3000/auth/token/`,
				xhrFields: {
					withCredentials: true, // Include cookies in the request
				},
				success: function (data) {
					resolve(data);
				},
				error: function (xhr, status, error) {
					reject({ xhr, status, error });
				},
			}
		);
	});

	try {
		const data = await jx;
		$("#reqAuthBtn").text("Sign out");
		/*
			jwt_decoded: {
				userId: 1,
				name: 'Xellanix',
				email: 'xellanix.prod@gmail.com',
				access_id: 2,
				iat: 1717838027,
				exp: 1717838047
			}
		*/
		sessionStorage.setItem("accessToken", data.accessToken);
		sessionStorage.setItem("exp", data.jwt_decoded.exp);
	} catch ({ xhr, status, error }) {
		// Handle error
		let errorCode = xhr.status;
		let errorText = xhr.statusText;
		let errorMessage = `<span><strong>Error ${errorCode}</strong>: ${errorText}</span>`;

		console.error(errorMessage);
	}
}

async function retrieveUsableToken() {
	const exp = sessionStorage.getItem("exp");
	if (!exp) {
		console.error("retrieveUsableToken: exp not found");
		return;
	}

	const currentDate = new Date();
	if (currentDate.getTime() > exp * 1000) {
		await refreshToken();
	}

	const accessToken = sessionStorage.getItem("accessToken");

	return accessToken;
}

async function fetchProducts() {
	const accessToken = await retrieveUsableToken();
	const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

	// Send GET request to get json value
	ajaxRequest(headers, {
		type: "GET",
		url: "http://localhost:3000/api/da24dea7-d4ce-4e31-a531-96d6c466ea38",
		success: function ({ items, action }) {
			const hasAction = Object.entries(action).length > 0;

			items.forEach((item) => {
				if (item.access_type === "user") {
					$("#products-container").append(`<div class="product-item">
						<h3>${item.product_name}</h3>
						<p>${item.description}</p>

						<div class="vertical-layout flex-no-gap">
                            <div class="button accent flex-self-center">
                                <a href="${
									item.learn_link
								}" target="_blank" tabindex="-1">Learn More</a>
                            </div>
                            ${
								hasAction
									? `<div class="horizontal-layout flex-no-vgap flex-align-center" style="column-gap: 8px !important;">
								${
									action.edit
										? `<button type="button" data-product-ref="${item.product_id}" class="button icon accent flex-self-center product-item-edit" tabindex="-1">
									<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.8"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
								</button>`
										: ""
								}
                            </div>`
									: ""
							}
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

async function fetchMembers() {
	const accessToken = await retrieveUsableToken();
	const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

	// Send GET request to get json value
	ajaxRequest(headers, {
		type: "GET",
		url: "http://localhost:3000/api/2410fb2e-bd08-4678-be1b-c05ebb13a5c1",
		success: function ({ items, action }) {
			const hasAction = Object.entries(action).length > 0;

			items.forEach((item) => {
				if (item.access_type === "user") {
					$("#members-container").append(`<div class="team-member-item">
						<img src="${item.member_photo}" alt="${item.member_name} Picture">
						<div class="vertical-layout">
							<h3>${item.member_name}</h3>
							<p>${item.member_role}</p>
						</div>
						${
							hasAction
								? `<div class="horizontal-layout flex-no-vgap flex-align-center" style="column-gap: 8px !important;">
							${
								action.edit
									? `<button type="button" data-member-ref="${item.member_id}" class="button icon accent flex-self-center member-edit" tabindex="-1">
								<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.8"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
							</button>`
									: ""
							}
                        </div>`
								: ""
						}
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

async function loadTask() {
	await refreshToken();
	await fetchProducts();
	await fetchMembers();
}
loadTask();
