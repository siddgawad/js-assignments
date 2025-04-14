// cardDetail.js

export function openCardModal(card) {
    const modal = document.getElementById("cardModal");
    modal.classList.remove("hidden");
    modal.innerHTML = ""; // Clear previous content
  
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
  
    const title = card.querySelector("h3").textContent;
    const date = card.querySelector(".date")?.textContent || "";
    const time = card.querySelector(".time")?.textContent || "";
    const priority = card.getAttribute("data-priority") || "";
    const imageSrc = card.querySelector("img")?.src || "";
  
    // 🧠 CARD TITLE
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = title;
  
    // 📝 DESCRIPTION
    const descriptionInput = document.createElement("textarea");
    descriptionInput.placeholder = "Add a description...";
    descriptionInput.value = card.getAttribute("data-description") || "";
  
    // 📷 Image upload
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
  
    // Show image preview if exists
    const imagePreview = document.createElement("img");
    if (imageSrc) {
      imagePreview.src = imageSrc;
      imagePreview.style.maxWidth = "100%";
      imagePreview.style.borderRadius = "6px";
      imagePreview.style.marginBottom = "10px";
      imagePreview.draggable = false;
      modalContent.appendChild(imagePreview);
    }
  
    // 📅 Due date
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = card.getAttribute("data-due") || "";
  
    // ✅ Save + ❌ Cancel
    const actions = document.createElement("div");
    actions.classList.add("modal-actions");
  
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.className = "save-btn";
  
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "cancel-btn";
  
    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);
  
    modalContent.appendChild(titleInput);
    modalContent.appendChild(descriptionInput);
    modalContent.appendChild(fileInput);
    modalContent.appendChild(dateInput);
    modalContent.appendChild(actions);
    modal.appendChild(modalContent);
  
    cancelBtn.onclick = () => {
      modal.classList.add("hidden");
    };
  
    saveBtn.onclick = () => {
      // Update card data from modal inputs
      card.querySelector("h3").textContent = titleInput.value;
      card.setAttribute("data-description", descriptionInput.value);
      card.setAttribute("data-due", dateInput.value);
  
      if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.style.maxWidth = "100%";
          img.style.marginTop = "10px";
          img.style.borderRadius = "6px";
          img.draggable = false;
  
          const existing = card.querySelector("img");
          if (existing) existing.remove();
          card.appendChild(img);
          modal.classList.add("hidden");
        };
        reader.readAsDataURL(fileInput.files[0]);
      } else {
        modal.classList.add("hidden");
      }
    };
  
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    };
  }
  
  export default openCardModal;
  