function onMemberNameChange() {
	const newVal = $("#member_name").val() || "Default Name";
	$("#new-member-preview-name").text(newVal);
	$("#new-member-preview-img").attr("alt", `${newVal} Picture`);
}
function onMemberRoleChange() {
	const newVal = $("#member_role").val() || "User";
	$("#new-member-preview-role").text(newVal);
}
function onMemberImgChange(input) {
	if (input.files && input.files[0]) {
		const reader = new FileReader();

		reader.onload = function (e) {
			$("#new-member-preview-img").attr("src", e.target.result || "/");
		};

		reader.readAsDataURL(input.files[0]);
	}
}
function onMemberSubmit(event) {
	event.preventDefault();

	const final = retrieveFormData(event.target);

	$.ajax({
		type: "POST",
		url: "http://localhost:3000/api/23b9d3e8-ae4d-4420-b136-ea905f7844ed",
		data: final,
		processData: false,
		contentType: false,
		success: async function (data) {
			// Do something with the response
			console.log("success: " + data.message);
			$("#new-product-error-wrapper").append(
				infoBox("success", `<span><strong>Success </strong>: ${data.message}</span>`)
			);
			$("#new-product-error-wrapper").show();

			await delay(2000);
			location.reload();
		},
		error: function (xhr, status, error) {
			// Handle error
			let errorCode = xhr.status;
			let errorText = xhr.statusText;
			let errorMessage = `<span><strong>Error ${errorCode}</strong>: ${errorText}</span>`;

			$("#new-member-error-wrapper").append(infoBox("error", errorMessage));
			$("#new-member-error-wrapper").show();
		},
	});

	return false;
}

$(document).on("memberPopupLoaded", function (event, element) {
	$("#new-member-error-wrapper").hide();
});
$(document).on("updateMemberPopupLoaded", function (event, element) {
	$("#new-member-error-wrapper").hide();
});

$("#members-container").on("click", ".member-edit", function (event) {
	const memberRef = $(event.currentTarget).data("memberRef");
	memberRef && openPopup(updateProductPopup(memberRef), "updateMemberPopupLoaded");
});

function newMemberPopup() {
	const fields = [
		{
			name: "member_name",
			type: "text",
			placeholder: "The member name",
			label: "Name",
			onInput: "onMemberNameChange",
			emptyError: "Enter the member name",
			patternError: "Member name is invalid",
		},
		{
			name: "member_role",
			type: "text",
			placeholder: "The member role",
			label: "Role",
			onInput: "onMemberRoleChange",
			emptyError: "Enter the member role",
			patternError: "Member role is invalid",
		},
		{
			name: "member_img",
			type: "file_picker",
			placeholder: "",
			label: "Member Picture",
			onInput: "onMemberImgChange",
			emptyError: "Enter the image link",
			patternError: "Image link is invalid",
		},
	];

	const final = `
    <div class="horizontal-container-layout flex-align-center">
        <div class="vertical-layout flex-align-center" style="flex: 1 1 0">
            <h2 class="text-align-center">Add a New Member</h2>
            <div id="new-member-error-wrapper" class="wrapper-only" style="align-self: stretch"></div>
            <form
                id="new-member-form"
                class="vertical-layout flex-self-init flex-align-center"
                style="margin-top: var(--section-gap-vertical)"
                onsubmit="return onMemberSubmit(event)"
            >
                ${fields.map((field) => inputField(field)).join("")}
                <button
                    type="submit"
                    class="button accent flex-self-center"
                    style="margin-top: var(--section-gap-vertical)"
                >
                    Add This Member
                </button>
            </form>
        </div>
        <div class="vertical-layout flex-align-center" style="position: sticky; top: 0; align-self: flex-start; flex: 0 1 0;">
            <h4 class="text-align-center">Preview</h4>
            <div class="team-member-item text-align-center">
                <img id="new-member-preview-img" src="assets/member/donny.jpg" alt="Default Name Picture">
                <div class="vertical-layout">
                    <h3 id="new-member-preview-name">Default Name</h3>
                    <p id="new-member-preview-role">User</p>
                </div>
            </div>
        </div>
    </div>
    `;

	return final;
}

function updateMemberPopup(memberRef) {
	const fields = [
		{
			name: "member_name",
			type: "text",
			placeholder: "The member name",
			label: "Name",
			onInput: "onMemberNameChange",
			emptyError: "Enter the member name",
			patternError: "Member name is invalid",
		},
		{
			name: "member_role",
			type: "text",
			placeholder: "The member role",
			label: "Role",
			onInput: "onMemberRoleChange",
			emptyError: "Enter the member role",
			patternError: "Member role is invalid",
		},
		{
			name: "member_img",
			type: "file_picker",
			placeholder: "",
			label: "Member Picture",
			onInput: "onMemberImgChange",
			emptyError: "Enter the image link",
			patternError: "Image link is invalid",
		},
	];

	const final = `
    <div class="horizontal-container-layout flex-align-center">
        <div class="vertical-layout flex-align-center" style="flex: 1 1 0">
            <h2 class="text-align-center">Edit Member: #${memberRef}</h2>
            <div id="new-member-error-wrapper" class="wrapper-only" style="align-self: stretch"></div>
            <form
                id="update-member-form"
                class="vertical-layout flex-self-init flex-align-center"
                style="margin-top: var(--section-gap-vertical)"
                onsubmit="return onMemberSubmit(event)"
            >
                ${fields.map((field) => inputField(field)).join("")}
                <button
                    type="submit"
                    class="button accent flex-self-center"
                    style="margin-top: var(--section-gap-vertical)"
                >
                    Add This Member
                </button>
            </form>
        </div>
        <div class="vertical-layout flex-align-center" style="position: sticky; top: 0; align-self: flex-start; flex: 0 1 0;">
            <h4 class="text-align-center">Preview</h4>
            <div class="team-member-item text-align-center">
                <img id="new-member-preview-img" src="assets/member/donny.jpg" alt="Default Name Picture">
                <div class="vertical-layout">
                    <h3 id="new-member-preview-name">Default Name</h3>
                    <p id="new-member-preview-role">User</p>
                </div>
            </div>
        </div>
    </div>
    `;

	return final;
}
