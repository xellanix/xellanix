$(document).ready(function () {
	$("#openPopup").click(function () {
		if ($("#openPopup").text() === "Sign In") {
			onSignInSubmit();
		} else {
			signOutUser();
		}
	});
});

function onSignInSubmit(event) {
	event.preventDefault();

	const final = retrieveFormEntries(event.target);

	// Send the "final" data to backend
	$.ajax({
		type: "POST",
		url: "http://localhost:3000/auth",
		data: JSON.stringify(final),
		contentType: "application/json",
		success: async function (data) {
			// Do something with the response
			$("#openPopup").text("Sign Out");
			console.log("success: " + data.message);
			console.log("access_token: " + data.accessToken);
			$("#user-signin-error-wrapper").append(
				infoBox("success", `<span><strong>Success </strong>: ${data.message}</span>`)
			);
			$("#user-signin-error-wrapper").show();

			await delay(2000);
			refreshToken();
			//location.reload();
		},
		error: function (xhr, status, error) {
			// Handle error
			let errorCode = xhr.status;
			let errorText = xhr.statusText;
			let errorMessage = `<span><strong>Error ${errorCode}</strong>: ${errorText}</span>`;

			$("#user-signin-error-wrapper").append(infoBox("error", errorMessage));
			$("#user-signin-error-wrapper").show();
		},
	});
	return false;
}

$(document).on("authPopupLoaded", function (event, element) {
	$("#user-signin-error-wrapper").hide();
});

function onUserSignIn() {
	const fields = [
		{
			name: "email",
			type: "email",
			placeholder: "Input your email",
			label: "Email",
			emptyError: "Please enter your email",
			patternError: "Email not found",
		},
		{
			name: "password",
			type: "password",
			placeholder: "Input your password",
			label: "Password",
			emptyError: "Please enter your password",
			patternError: "Wrong password",
		},
	];

	const final = `
    <div class="horizontal-container-layout flex-align-center">
        <div class="vertical-layout flex-align-center" style="flex: 1 1 0">
			<h2 class="text-align-center">Sign in to Xellanix</h2>
            <div id="user-signin-error-wrapper" class="wrapper-only" style="align-self: stretch"></div>
			<form
                id="signin-form"
                class="vertical-layout flex-self-init flex-align-center"
                onsubmit="return onSignInSubmit(event)"
            >
                ${fields.map((field) => inputField(field)).join("")}
                <button
                    type="submit"
                    class="button accent flex-self-center"
                    style="margin-top: var(--section-gap-vertical)"
                >
                    Sign in
                </button>
            </form>
        </div>
    </div>
    `;

	return final;
}
/* 
$(document).on("regPopupLoaded", function (event, element) {
	$("#user-signin-error-wrapper").hide();
});

function onUserSignUp() {
	const fields = [
		{
			name: "username",
			type: "text",
			placeholder: "Input your username",
			label: "Username",
			onInput: "onUsername",
			emptyError: "Please enter your username",
			patternError: "Username is invalid",
		},
		{
			name: "email",
			type: "text",
			placeholder: "Input your email",
			label: "Email",
			onInput: "onEmail",
			emptyError: "Please enter your email",
			patternError: "Email is invalid",
		},
		{
			name: "password",
			type: "text",
			placeholder: "Input your password",
			label: "Password",
			onInput: "onPassword",
			emptyError: "Please enter your password",
			patternError: "Password is invalid",
		},
		{
			name: "confirm_password",
			type: "text",
			placeholder: "Re-input your password",
			label: "Confirm Password",
			onInput: "onConfirmPassword",
			emptyError: "Please re-input your password",
			patternError: "Password and Confirm Password does not match",
		},
	];

	const final = `
    <div class="horizontal-container-layout flex-align-center">
        <div class="vertical-layout flex-align-center" style="flex: 1 1 0">
            <h2 class="text-align-center">Register</h2>
            <form
                id="signup-form"
                class="vertical-layout flex-self-init flex-align-center"
                onsubmit="return onSignUpSubmit(event)"
            >
                ${fields.map((field) => inputField(field)).join("")}
                <button
                    type="submit"
                    class="button accent flex-self-center"
                    style="margin-top: var(--section-gap-vertical)"
                >
                    Register
                </button>
            </form>
        </div>
        `;
	return final;
}
*/

function signOutUser() {
	$.ajax({
		type: "DELETE",
		url: "http://localhost:3000/auth/signout",
		data: JSON.stringify({}),
		contentType: "application/json",
		success: async function (data) {
			console.log("Signed out successfully: " + data.message);

			// Optional: Display success message to the user
			$("#user-signin-error-wrapper").append(
				infoBox("success", `<span><strong>Success </strong>: ${data.message}</span>`)
			);
			$("#user-signin-error-wrapper").show();

			await delay(2000);
			location.reload();

			// Change the button text back to "Sign In" upon successful sign-out
			$("#auth-button").text("Sign In");
		},
		error: function (xhr, status, error) {
			let errorCode = xhr.status;
			let errorText = xhr.statusText;
			let errorMessage = `<span><strong>Error ${errorCode}</strong>: ${errorText}</span>`;

			console.error(errorMessage);

			// Optional: Display error message to the user
			/* $("#user-signin-error-wrapper").append(infoBox("error", errorMessage));
            $("#user-signin-error-wrapper").show(); */
		},
	});
}

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
