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

			if (items?.length > 0) {
				$("#products-container").find("*").off();
				$("#products-container").empty();
			}

			items?.forEach((item) => {
				if (item.access_type === "user") {
					$("#products-container").append(
						htmlBuilder({
							tag: "div",
							classes: ["product-item"],
							children: [
								{
									tag: "h3",
									content: item.product_name,
								},
								{
									tag: "p",
									content: item.description,
								},
								{
									tag: "div",
									classes: ["vertical-layout", "flex-no-gap"],
									children: [
										{
											tag: "div",
											classes: ["button", "accent", "flex-self-center"],
											children: [
												{
													tag: "a",
													attrs: {
														href: item.learn_link,
														target: "_blank",
														tabindex: "-1",
													},
													content: "Learn More",
												},
											],
										},
										{
											tag: "div",
											classes: [
												"horizontal-layout",
												"flex-no-vgap",
												"flex-align-center",
											],
											addIf: hasAction,
											attrs: {
												style: "column-gap: 8px !important;",
											},
											children: [
												{
													tag: "button",
													classes: [
														"button",
														"icon",
														"accent",
														"flex-self-center",
														"product-item-edit",
													],
													addIf: action.edit,
													attrs: {
														type: "button",
														"data-product-ref": item.product_id,
														tabindex: "-1",
													},
													content: `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.8"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>`,
												},
											],
										},
									],
								},
							],
						})
					);
				} else if (item.access_type === "admin" || item.access_type === "superadmin") {
					$("#products-container").append(
						htmlBuilder({
							tag: "div",
							id: item.product_name,
							classes: ["product-item", "special-item"],
							children: [
								{
									tag: "h3",
									content: item.description,
								},
								{
									tag: "img",
									attrs: {
										src: "assets/product-new-item-icon.svg",
										alt: item.description + " Icon",
										style: "flex: 1 1 0;",
									},
								},
								{
									tag: "h3",
									content: item.description,
									attrs: {
										style: "visibility: hidden; --webkit-user-select: none; user-select: none;",
									},
								},
							],
						})
					);
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

			if (items?.length > 0) {
				$("#members-container").find("*").off();
				$("#members-container").empty();
			}

			items?.forEach((item) => {
				if (item.access_type === "user") {
					$("#members-container").append(
						htmlBuilder({
							tag: "div",
							classes: ["team-member-item"],
							children: [
								{
									tag: "img",
									attrs: {
										src: item.member_photo,
										alt: item.member_name + " Picture",
									},
								},
								{
									tag: "div",
									classes: ["vertical-layout"],
									children: [
										{
											tag: "h3",
											content: item.member_name,
										},
										{
											tag: "p",
											content: item.member_role,
										},
									],
								},
								{
									tag: "div",
									classes: [
										"horizontal-layout",
										"flex-no-vgap",
										"flex-align-center",
									],
									addIf: hasAction,
									attrs: {
										style: "column-gap: 8px !important;",
									},
									children: [
										{
											tag: "button",
											addIf: action.edit,
											classes: [
												"button",
												"icon",
												"accent",
												"flex-self-center",
												"member-edit",
											],
											attrs: {
												type: "button",
												"data-member-ref": item.member_id,
												tabindex: "-1",
											},
											content: `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.8"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>`,
										},
									],
								},
							],
						})
					);
				} else if (item.access_type === "admin" || item.access_type === "superadmin") {
					$("#members-container").append(
						htmlBuilder({
							tag: "div",
							id: item.member_name,
							classes: ["product-item", "special-item"],
							children: [
								{ tag: "h3", content: item.member_role },
								{
									tag: "img",
									attrs: {
										src: "assets/member-new-item-icon.svg",
										alt: item.member_role + " Icon",
										style: "flex: 1 1 0;",
									},
								},
								{
									tag: "h3",
									content: item.member_role,
									attrs: {
										style: "visibility: hidden; --webkit-user-select: none; user-select: none;",
									},
								},
							],
						})
					);
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
