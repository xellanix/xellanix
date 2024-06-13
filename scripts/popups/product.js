function onProductNameChange() {
	const newVal = $("#prod_name").val() || "Default Name";
	$("#new-product-preview-name").text(newVal);
}
function onProductDescChange() {
	const newVal = $("#prod_desc").val() || "Description";
	$("#new-product-preview-description").text(newVal);
}
function onProductUrlChange() {
	const newVal = $("#prod_url").val() || "/";
	$("#new-product-preview-link").attr("href", newVal);
}
async function onProductSubmit(event) {
	event.preventDefault();

	const submitBtn = $(event.target).find("button[type='submit']");
	submitBtn.prop("disabled", true);
	submitBtn.text("Adding...");

	const final = retrieveFormEntries(event.target);

	const accessToken = await retrieveUsableToken();
	const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

	// Send the "final" data to backend
	ajaxRequest(headers, {
		type: "POST",
		url: `${basePath}/api/eb82c110-9a34-46a0-9587-db8bf8576014`,
		data: JSON.stringify(final),
		contentType: "application/json",
		success: async function (data) {
			// Do something with the response
			console.log("success: " + data.message);
			$("#new-product-error-wrapper").find("*").off();
			$("#new-product-error-wrapper").empty();
			$("#new-product-error-wrapper").append(
				infoBox("success", `<span><strong>Success </strong>: ${data.message}</span>`)
			);
			$("#new-product-error-wrapper").show();

			submitBtn.text("Product Added");

			await delay(2000);
			location.reload();
		},
		error: function (xhr, status, error) {
			// Handle error
			let errorCode = xhr.status;
			let errorText = xhr.statusText;
			let errorMessage = `<span><strong>Error ${errorCode}</strong>: ${errorText}</span>`;

			$("#new-product-error-wrapper").find("*").off();
			$("#new-product-error-wrapper").empty();
			$("#new-product-error-wrapper").append(infoBox("error", errorMessage));
			$("#new-product-error-wrapper").show();

			submitBtn.text("Add This Product");
			submitBtn.prop("disabled", false);
		},
	});

	return false;
}

function onProductUpdatedSubmit(event) {
	event.preventDefault();

	const final = retrieveFormEntries(event.target);

	return false;
}

$(document).on("productPopupLoaded", function (event, element) {
	$("#new-product-error-wrapper").hide();
});
$(document).on("updateProductPopupLoaded", function (event, element) {
	$("#update-product-error-wrapper").hide();
});
$(document).on("deleteProductPopupLoaded", function (event, element) {
	$("#delete-product-error-wrapper").hide();

	$("#confirm-delete-product").on("click", function (e) {
		const productRef = $(e.currentTarget).data("productRef");
		ajaxRequest(
			{},
			{
				type: "DELETE",
				url: `${basePath}/api/xxx/${productRef}`,
				success: function (data) {
					// Do something with the response
					console.log("success: " + data.message);
					location.reload();
				},
				error: function (xhr, status, error) {
					// Handle error
					let errorCode = xhr.status;
					let errorText = xhr.statusText;
					let errorMessage = `<span><strong>Error ${errorCode}</strong>: ${errorText}</span>`;

					$("#delete-product-error-wrapper").find("*").off();
					$("#delete-product-error-wrapper").empty();
					$("#delete-product-error-wrapper").append(infoBox("error", errorMessage));
					$("#delete-product-error-wrapper").show();
				},
			}
		);
	});

	$("#cancel-delete-product").on("click", function () {
		closePopup();
	});
});

$("#products-container").on("click", ".product-item-edit", function (event) {
	const productRef = $(event.currentTarget).data("productRef");
	productRef && openPopup(updateProductPopup(productRef), "updateProductPopupLoaded");
});

$("#products-container").on("click", ".product-item-delete", function (event) {
	const productRef = $(event.currentTarget).data("productRef");
	productRef && openPopup(deleteProductPopup(productRef), "deleteProductPopupLoaded");
});

function newProductPopup() {
	const fields = [
		{
			name: "prod_name",
			type: "text",
			placeholder: "The product name",
			label: "Name",
			onInput: "onProductNameChange",
			emptyError: "Enter the product name",
			patternError: "Product name is invalid",
		},
		{
			name: "prod_desc",
			type: "text_long",
			placeholder: "The product description",
			label: "Description",
			onInput: "onProductDescChange",
			emptyError: "Enter the product description",
			patternError: "Product description is invalid",
		},
		{
			name: "prod_url",
			type: "url",
			placeholder: "https://github.com/xellanix/product",
			label: "Target Link",
			onInput: "onProductUrlChange",
			emptyError: "Enter the target link",
			patternError: "Target link is invalid",
		},
	];

	const final = `
    <div class="horizontal-container-layout flex-align-center">
        <div class="vertical-layout flex-align-center" style="flex: 1 1 0">
            <h2 class="text-align-center">Add a New Product</h2>
            <div id="new-product-error-wrapper" class="wrapper-only" style="align-self: stretch"></div>
            <form
                id="new-product-form"
                class="vertical-layout flex-self-init flex-align-center"
                style="margin-top: var(--section-gap-vertical)"
                onsubmit="return onProductSubmit(event)"
            >
                ${fields.map((field) => inputField(field)).join("")}
                <button
                    type="submit"
                    class="button accent flex-self-center"
                    style="margin-top: var(--section-gap-vertical)"
                >
                    Add This Product
                </button>
            </form>
        </div>
        <div class="vertical-layout flex-align-center" style="position: sticky; top: 0; align-self: flex-start; flex: 0 1 0;">
            <h4 class="text-align-center">Preview</h4>
            <div class="product-item text-align-center">
                <h3 id="new-product-preview-name">Default Name</h3>
                <p id="new-product-preview-description">Description</p>
                <div class="button accent">
                    <a id="new-product-preview-link" href="/" target="_blank" tabindex="-1">Learn More</a>
                </div>
            </div>
        </div>
    </div>
    `;

	return final;
}

function updateProductPopup(productRef) {
	const fields = [
		{
			name: "prod_name",
			type: "text",
			placeholder: "The product name",
			label: "Name",
			onInput: "onProductNameChange",
			emptyError: "Enter the product name",
			patternError: "Product name is invalid",
		},
		{
			name: "prod_desc",
			type: "text_long",
			placeholder: "The product description",
			label: "Description",
			onInput: "onProductDescChange",
			emptyError: "Enter the product description",
			patternError: "Product description is invalid",
		},
		{
			name: "prod_url",
			type: "url",
			placeholder: "https://github.com/xellanix/product",
			label: "Target Link",
			onInput: "onProductUrlChange",
			emptyError: "Enter the target link",
			patternError: "Target link is invalid",
		},
	];

	const final = `
    <div class="horizontal-container-layout flex-align-center">
        <div class="vertical-layout flex-align-center" style="flex: 1 1 0">
            <h2 class="text-align-center">Edit Product: #${productRef}</h2>
            <div id="update-product-error-wrapper" class="wrapper-only" style="align-self: stretch"></div>
            <form
                id="update-product-form"
                class="vertical-layout flex-self-init flex-align-center"
                style="margin-top: var(--section-gap-vertical)"
                onsubmit="return onProductUpdatedSubmit(event)"
            >
                ${fields.map((field) => inputField(field)).join("")}
                <button
                    type="submit"
                    class="button accent flex-self-center"
                    style="margin-top: var(--section-gap-vertical)"
                >
                    Update This Product
                </button>
            </form>
        </div>
        <div class="vertical-layout flex-align-center" style="position: sticky; top: 0; align-self: flex-start; flex: 0 1 0;">
            <h4 class="text-align-center">Preview</h4>
            <div class="product-item text-align-center">
                <h3 id="new-product-preview-name">Default Name</h3>
                <p id="new-product-preview-description">Description</p>
                <div class="button accent">
                    <a id="new-product-preview-link" href="/" target="_blank" tabindex="-1">Learn More</a>
                </div>
            </div>
        </div>
    </div>
    `;

	return final;
}

function deleteProductPopup(productRef) {
	const final = `
    <div class="horizontal-container-layout flex-align-center">
        <div class="vertical-layout flex-align-center" style="flex: 1 1 0">
            <h2 class="text-align-center">Delete Product: #${productRef}</h2>
            <div id="delete-product-error-wrapper" class="wrapper-only" style="align-self: stretch"></div>
            
			<h4 style="margin-top: var(--section-gap-vertical); font-weight: 500;" class="text-align-center">Are you sure want to delete this product?</h4>
			<div class="horizontal-layout flex-align-center" style="margin-top: var(--section-gap-vertical); column-gap: 8px !important;">
				<button type="button" id="confirm-delete-product" class="button error flex-self-stretch" style="flex: 1 1 0" data-product-ref="${productRef}">Delete</button>
				<button type="button" id="cancel-delete-product" class="button flex-self-stretch" style="flex: 1 1 0">Cancel</button>
			</div>
        </div>
    </div>
    `;

	return final;
}
