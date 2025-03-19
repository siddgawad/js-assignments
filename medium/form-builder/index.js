function field_type() {
  const field = document.getElementById("field-type");
  const label = document.getElementById("field-label");
  const add_field_btn = document.getElementById("add-field-btn");

  field.addEventListener("change", () => {
    const selected_type = field.value;

    if (selected_type === "text") {
      label.placeholder = "Enter text input label";
      add_field_btn.textContent = "Add Text Input";
    } else if (selected_type === "checkbox") {
      label.placeholder = "Enter checkbox label";
      add_field_btn.textContent = "Add Checkbox";
    } else if (selected_type === "radio") {
      label.placeholder = "Enter radio button label";
      add_field_btn.textContent = "Add Radio Button";
    }
  });
}

function add_field() {
  const selected_type = document.getElementById("field-type").value;
  const field_label = document.getElementById("field-label").value;
  const preview_area = document.getElementById("preview-area");

  if (!field_label) {
    alert("Please enter a label before adding the field!");
    return;
  }

  if (selected_type === "text") {
    // Create a text input field
    const text_field = document.createElement("input");
    text_field.type = "text";
    text_field.placeholder = field_label;
    text_field.classList.add("form-field", "text-field"); // Additional class for better styling

    preview_area.appendChild(text_field);
  } else if (selected_type === "checkbox" || selected_type === "radio") {
    // Create a label wrapper to keep text & input together
    const wrapper = document.createElement("label");
    wrapper.style.display = "inline-flex"; // Keep items in one line
    wrapper.style.alignItems = "center";   // Align text and checkbox properly
    wrapper.style.gap = "8px";             // Space between checkbox and text

    // Create input field first (so it appears on the left)
    const input_field = document.createElement("input");
    input_field.type = selected_type;
    input_field.classList.add("form-field");

    // Create text label
    const text_span = document.createElement("span");
    text_span.textContent = " " + field_label;

    // Append checkbox first, then text
    wrapper.appendChild(input_field);
    wrapper.appendChild(text_span);

    preview_area.appendChild(wrapper);
  }

  // Reset input field after adding
  document.getElementById("field-label").value = "";
}

field_type();
document.getElementById("add-field-btn").addEventListener("click", add_field);
