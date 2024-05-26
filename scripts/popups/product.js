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
function onProductSubmit(event) {
	event.preventDefault();

	const final = retrieveFormEntries(event.target);

	/* const error = false;
	if (error) {
		$("#new-product-error-wrapper").append(infoBox("error", "message"));
		$("#new-product-error-wrapper").show();
	} */

	return false;
}

$(document).on("productPopupLoaded", function (event, element) {
	$("#new-product-error-wrapper").hide();
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
