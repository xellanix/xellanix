function checkInputValidity(e) {
	const target = e.target;
	const name = target.name;
	const value = target.value;
	const { emptyError, patternError, errorId } = target.dataset;

	function setError(value = "") {
		$(`#${errorId}`).removeClass("hidden");
		$(`#${errorId}`).text(value);
	}

	// value not available
	if (!isAvailable(value)) {
		setError(emptyError);
	} else setError(patternError);
}

function defaultInput(
	name = "",
	type = "",
	placeholder = "",
	onInput = "",
	emptyError = "",
	patternError = "",
	errorId = ""
) {
	const final = `<input
        name="${name}"
        id="${name}"
        type="${type}"
        placeholder="${placeholder}"
        required
        oninput='${onInput}(), checkInputValidity(event)'
        oninvalid="checkInputValidity(event)"
        data-empty-error="${emptyError}"
        data-pattern-error="${patternError}"
        data-error-id="${errorId}"
    />`;

	return final;
}

function textLongInput(
	name = "",
	placeholder = "",
	onInput = "",
	emptyError = "",
	patternError = "",
	errorId = ""
) {
	const final = `<textarea
        name="${name}"
        id="${name}"
        rows="4"
        cols="50"
        placeholder="${placeholder}"
        required
        oninput='${onInput}(), checkInputValidity(event)'
        oninvalid="checkInputValidity(event)"
        data-empty-error="${emptyError}"
        data-pattern-error="${patternError}"
        data-error-id="${errorId}"></textarea>`;

	return final;
}

function filePickerInput(
	name = "",
	acceptType = "",
	onInput = "",
	emptyError = "",
	patternError = "",
	errorId = ""
) {
	const final = `<input
        name="${name}"
        id="${name}"
        type="file"
        accept="${acceptType}"
        required
        onchange='${onInput}(this), checkInputValidity(event)'
        oninvalid="checkInputValidity(event)"
        data-empty-error="${emptyError}"
        data-pattern-error="${patternError}"
        data-error-id="${errorId}"
    />`;

	return final;
}

function inputField(field) {
	let { label, name, type, placeholder, onInput, emptyError, patternError } = field;
	const customType = type.includes("_long") ? 1 : type.includes("file_picker") ? 2 : 0;

	const errorId = uuidv4();

	return `
    <div class="vertical-layout" style="gap: 8px">
        <label for="${name}">${label}</label>
        ${
			customType === 1
				? textLongInput(name, placeholder, onInput, emptyError, patternError, errorId)
				: customType === 2
				? filePickerInput(
						name,
						"image/png, image/jpeg, image/webp, image/tiff",
						onInput,
						emptyError,
						patternError,
						errorId
				  )
				: defaultInput(name, type, placeholder, onInput, emptyError, patternError, errorId)
		}

        <span id="${errorId}" class="input-field-error hidden" style="color: var(--error-color)">
            Error: ...
        </span>
    </div>
    `;
}
