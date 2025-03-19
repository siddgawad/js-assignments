document.addEventListener("DOMContentLoaded", function () {
    function addCard(cardContainer) {
        const taskTitle = prompt("Enter Task Title:");
        if (!taskTitle) return;

        const priority = prompt("Enter Priority - low, medium, urgent:").toLowerCase();
        const validPriorities = ["low", "medium", "urgent"];
        if (!validPriorities.includes(priority)) {
            alert("Invalid priority! Please enter low, medium, or urgent.");
            return;
        }

        // Create new card element
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("draggable", "true");
        card.addEventListener("dragstart", handleDragStart);
        card.setAttribute("data-priority", priority);

        // Card Header
        const cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header");

        const cardTitle = document.createElement("h3");
        cardTitle.textContent = taskTitle;

        const cardPriority = document.createElement("span");
        cardPriority.classList.add("priority", priority);
        cardPriority.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
        cardPriority.setAttribute("data-priority-span", "true");

        cardHeader.appendChild(cardTitle);
        cardHeader.appendChild(cardPriority);

        // Card Footer
        const cardFooter = document.createElement("div");
        cardFooter.classList.add("card-footer");

        const dateElement = document.createElement("p");
        dateElement.classList.add("date");
        const currentDate = new Date();
        dateElement.textContent = currentDate.toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric"
        });

        const timeElement = document.createElement("p");
        timeElement.classList.add("time");
        timeElement.setAttribute("data-timestamp", currentDate.getTime());
        timeElement.textContent = "Just now";

        cardFooter.appendChild(dateElement);
        cardFooter.appendChild(timeElement);

        // Append everything to the card
        card.appendChild(cardHeader);
        card.appendChild(cardFooter);
        cardContainer.appendChild(card);
    }

    document.querySelectorAll(".add-new").forEach(button => {
        button.addEventListener("click", (event) => {
            const column = event.target.closest(".column");
            const cardContainer = column.querySelector(".cards-container");
            addCard(cardContainer);
        });
    });

    function updateTimeAgo() {
        document.querySelectorAll(".time").forEach(timeElement => {
            const timestamp = timeElement.getAttribute("data-timestamp");
            if (!timestamp) return;

            const timeDiff = Math.floor((Date.now() - timestamp) / 1000);

            let newTimeText;
            if (timeDiff < 60) {
                newTimeText = "Just now";
            } else if (timeDiff < 3600) {
                newTimeText = `${Math.floor(timeDiff / 60)} mins ago`;
            } else if (timeDiff < 86400) {
                newTimeText = `${Math.floor(timeDiff / 3600)} hours ago`;
            } else {
                newTimeText = `${Math.floor(timeDiff / 86400)} days ago`;
            }

            timeElement.textContent = newTimeText;
        });
    }

    setInterval(updateTimeAgo, 30000);

    let draggedCard = null;

    function handleDragStart(event) {
        draggedCard = event.target;
        event.dataTransfer.setData("text/plain", "");

        if (!draggedCard.hasAttribute("data-priority")) {
            const prioritySpan = draggedCard.querySelector("[data-priority-span]");
            if (prioritySpan) {
                draggedCard.setAttribute("data-priority", prioritySpan.textContent.toLowerCase());
            }
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
        const container = event.target.closest(".cards-container");
        if (container) {
            container.classList.add("drag-over");
        }
    }

    function handleDragLeave(event) {
        const container = event.target.closest(".cards-container");
        if (container) {
            container.classList.remove("drag-over");
        }
    }

    function handleDrop(event) {
        event.preventDefault();
        const dropTarget = event.target.closest(".cards-container");
        if (dropTarget && draggedCard) {
            dropTarget.appendChild(draggedCard);
            dropTarget.classList.remove("drag-over");

            const columnTitle = dropTarget.closest(".column").querySelector("h2").textContent.trim();

            if (columnTitle === "Finished") {
                removePriorityAndAddDelete(draggedCard);
            } else {
                restorePriorityAndRemoveDelete(draggedCard);
            }
        }
    }

    function removePriorityAndAddDelete(card) {
        const prioritySpan = card.querySelector("[data-priority-span]");
        if (prioritySpan) {
            prioritySpan.remove();
        }

        if (!card.querySelector(".delete-btn")) {
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => card.remove());

            card.appendChild(deleteBtn);
        }
    }

    function restorePriorityAndRemoveDelete(card) {
        if (!card.querySelector("[data-priority-span]")) {
            const restoredPriority = card.getAttribute("data-priority");
            if (restoredPriority) {
                const newPrioritySpan = document.createElement("span");
                newPrioritySpan.classList.add("priority", restoredPriority);
                newPrioritySpan.textContent = restoredPriority.charAt(0).toUpperCase() + restoredPriority.slice(1);
                newPrioritySpan.setAttribute("data-priority-span", "true");

                card.querySelector(".card-header").appendChild(newPrioritySpan);
            }
        }

        const deleteBtn = card.querySelector(".delete-btn");
        if (deleteBtn) {
            deleteBtn.remove();
        }
    }

    document.querySelectorAll(".cards-container").forEach(container => {
        container.addEventListener("dragover", handleDragOver);
        container.addEventListener("dragleave", handleDragLeave);
        container.addEventListener("drop", handleDrop);
    });

    document.querySelectorAll(".card").forEach(card => {
        card.setAttribute("draggable", "true");
        card.addEventListener("dragstart", handleDragStart);
    });
});
