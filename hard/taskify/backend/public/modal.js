// modal.js

export function createModernPrompt(message, defaultValue = "") {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";
  
      const modal = document.createElement("div");
      modal.className = "modal-content";
  
      const title = document.createElement("h3");
      title.textContent = message;
  
      const input = document.createElement("input");
      input.type = "text";
      input.value = defaultValue;
  
      const actions = document.createElement("div");
      actions.className = "modal-actions";
  
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.className = "btn-cancel";
  
      const confirmBtn = document.createElement("button");
      confirmBtn.textContent = "Confirm";
      confirmBtn.className = "btn-confirm";
  
      actions.appendChild(cancelBtn);
      actions.appendChild(confirmBtn);
  
      modal.appendChild(title);
      modal.appendChild(input);
      modal.appendChild(actions);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
  
      input.focus();
  
      const closeModal = () => {
        document.body.removeChild(overlay);
      };
  
      confirmBtn.onclick = () => {
        closeModal();
        resolve(input.value.trim());
      };
  
      cancelBtn.onclick = () => {
        closeModal();
        resolve(null);
      };
  
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          closeModal();
          resolve(null);
        }
      };
  
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") confirmBtn.click();
        if (e.key === "Escape") cancelBtn.click();
      });
    });
  }

export default createModernPrompt;
