document.addEventListener("DOMContentLoaded", function () {
    /*

    The DOMContentLoaded event fires when the HTML document has been completely parsed, and 
    all deferred scripts (<script defer src="…"> and <script type="module">) have downloaded and
     executed. It doesn't wait for other things like images, subframes, and async scripts to finish loading.

    */

    function addCard(cardContainer) {
        const taskTitle = prompt("Enter Task Title:");
        if (!taskTitle) return;

        const priority = prompt(
            "Enter Priority - low, medium, urgent:",
        ).toLowerCase();
        const validPriorities = ["low", "medium", "urgent"];
        if (!validPriorities.includes(priority)) {
            /* The includes() method of String values performs a case-sensitive search to 
            determine whether a given string may be found within this string, returning true or false as appropriate.
            also used for array.includes() 
            */
            alert("Invalid priority! Please enter low, medium, or urgent.");
            return;
        }

        // Create new card element
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("draggable", "true"); /*
        This line makes the card element (a <div>) draggable, meaning you can click and drag it with your mouse
        Here, it sets the draggable attribute to "true", which is an HTML5 feature that tells the browser this element can be dragged.
        The draggable attribute is a boolean attribute, which means it can have either the value "true" or "false".
        If the attribute is not present, the browser will assume the default value of "false".
        */
        card.addEventListener("dragstart", handleDragStart);

        /*
        addEventListener("event", function) is a way to watch for specific actions (events) on an element and respond to them.
        "dragstart" is an event that fires the moment you click and begin dragging a draggable element.
        handleDragStart is a function defined elsewhere in your code that handles what happens when dragging starts
         (e.g., it sets draggedCard to the card you’re dragging).

        */

        card.setAttribute("data-priority", priority);

        /*   setAttribute("data-priority", priority) adds a data-* attribute, where * can be any name (here, priority).
        priority comes from the user’s input earlier in the addCard function (e.g., prompt("Enter Priority...")).
        data-* attributes are a way to store custom data on HTML elements that your JavaScript can use later.

        This stores the card’s priority (e.g., "urgent") directly on the element. Later, when you drag the card
         between columns, your code can check this attribute to restore the priority label if needed (e.g., in restorePriorityAndRemoveDelete).
        */

        // Card Header
        const cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header");

        const cardTitle = document.createElement("h3");
        cardTitle.textContent = taskTitle;

        const cardPriority = document.createElement("span");
        cardPriority.classList.add("priority", priority);
        /*
        This line adds two CSS classes to the cardPriority element: "priority" and the value of the priority variable (e.g., "urgent").
        How It Works:
        cardPriority is a <span> element you created earlier with document.createElement("span").
        classList.add() is a method that lets you add one or more classes to an element’s class attribute.
        Here, it adds:
        "priority": A base class, likely for general styling of all priority labels (e.g., font size, padding).
        priority: The specific priority value (e.g., "low", "medium", or "urgent"), which comes from the user’s 
        input in the prompt. This could be used for specific styling (e.g., red for "urgent").


        */
        cardPriority.textContent =
            priority.charAt(0).toUpperCase() + priority.slice(1);
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
            year: "numeric",
        });

        const timeElement = document.createElement("p");
        timeElement.classList.add("time");
        timeElement.setAttribute("data-timestamp", currentDate.getTime());
        timeElement.textContent = "Just now";

        const button = document.createElement("button");
        button.textContent = "Mark as In Progress";

        button.addEventListener("click", function () {
            // Find the column with the "In Progress" heading
            const inProgressColumn = Array.from(document.querySelectorAll(".column")).find(column => 
                column.querySelector("h2").textContent.trim() === "In Progress"
            );
        
            if (!inProgressColumn) {
                console.error("In Progress column not found!");
                return;
            }
        
            // Get the correct cards container inside the column
            const inProgressContainer = inProgressColumn.querySelector(".cards-container");
            
            if (!inProgressContainer) {
                console.error("In Progress container not found!");
                return;
            }
        
            // Move the specific task to the "In Progress" column
            inProgressContainer.appendChild(this.parentElement.parentElement);
            this.remove(); // Remove the button after moving
        });

        cardFooter.appendChild(button);

        cardFooter.appendChild(dateElement);
        cardFooter.appendChild(timeElement);

        // Append everything to the card
        card.appendChild(cardHeader);
        card.appendChild(cardFooter);
        cardContainer.appendChild(card);
    }

    document.querySelectorAll(".add-new").forEach((button) => {
        button.addEventListener("click", (event) => {
            const column = event.target.closest(".column");
            const cardContainer = column.querySelector(".cards-container");
            addCard(cardContainer);
        });
    });

    function updateTimeAgo() {
        document.querySelectorAll(".time").forEach((timeElement) => {
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
            const prioritySpan = draggedCard.querySelector(
                "[data-priority-span]",
            );
            if (prioritySpan) {
                draggedCard.setAttribute(
                    "data-priority",
                    prioritySpan.textContent.toLowerCase(),
                );
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

            const columnTitle = dropTarget
                .closest(".column")
                .querySelector("h2")
                .textContent.trim();

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
                newPrioritySpan.textContent =
                    restoredPriority.charAt(0).toUpperCase() +
                    restoredPriority.slice(1);
                newPrioritySpan.setAttribute("data-priority-span", "true");

                card.querySelector(".card-header").appendChild(newPrioritySpan);
            }
        }

        const deleteBtn = card.querySelector(".delete-btn");
        if (deleteBtn) {
            deleteBtn.remove();
        }
    }

    document.querySelectorAll(".cards-container").forEach((container) => {
        container.addEventListener("dragover", handleDragOver);
        container.addEventListener("dragleave", handleDragLeave);
        container.addEventListener("drop", handleDrop);
    });

    document.querySelectorAll(".card").forEach((card) => {
        card.setAttribute("draggable", "true");
        card.addEventListener("dragstart", handleDragStart);
    });
});
