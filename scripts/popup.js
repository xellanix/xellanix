function openPopup(content = "", loadEvent = "") {
	$("html").addClass("hide-all");
	$("#popup").show();
	$("#popup-content").append(content);

	loadEvent && $(document).trigger(loadEvent, [$(content)]);
}

async function closePopup(useTransition = true) {
	if (useTransition) {
		$("#popup").addClass("out");
		await delay(300);
		$("#popup").removeClass("out");
	}

	$("#popup").hide();
	$("html").removeClass("hide-all");
	$("#popup-content").find("*").off();
	$("#popup-content").empty();
}

closePopup(false);

$("#popup-close-button").on("click", function () {
	closePopup();
});

$("#create-new-product-item-button").on("click", function () {
	openPopup(newProductPopup(), "productPopupLoaded");
});
$("#create-new-member-item-button").on("click", function () {
	openPopup(newMemberPopup(), "memberPopupLoaded");
});
