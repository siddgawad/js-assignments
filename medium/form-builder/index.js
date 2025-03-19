function field_type() {
    const field = document.getElementById("field-type");
    const preview_area = document.getElementById("preview-area");
  
    field.addEventListener("change", () => {
      const selected_type = field.value;
      const label = document.getElementById("field-label");
      const add_field_btn = document.getElementById("add-field-btn");
  
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
  
    // Quick check: no empty labels
    if (!field_label) {
      alert("Please enter a label before adding the field!");
      return;
    }
  
    if (selected_type === "text") {
      // For text input, we can use the placeholder to show the label
      const text_field = document.createElement("input");
      text_field.type = "text";
      text_field.placeholder = field_label;
      text_field.classList.add("form-field");
  
      // Append directly to preview area
      preview_area.appendChild(text_field);
    } else if (selected_type === "checkbox" || selected_type === "radio") {
      // For checkboxes/radios, use a label element so we can have text next to the input
      const wrapper = document.createElement("label");
  
      const input_field = document.createElement("input");
      input_field.type = selected_type;
      input_field.classList.add("form-field");
  
      // Insert the input before the label text (so input is on the left, text on the right)
      wrapper.appendChild(input_field);
      // Now add the text
      wrapper.appendChild(document.createTextNode(" " + field_label));
  
      preview_area.appendChild(wrapper);
    }
  
    // Reset the text field to empty after adding
    document.getElementById("field-label").value = "";
  }
  
  field_type();
  document.getElementById("add-field-btn").addEventListener("click", add_field);
  