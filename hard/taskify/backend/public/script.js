import createModernPrompt from "./modal.js";
import  openCardModal  from "./cardDetail.js";




const token = localStorage.getItem("token");
if (!token) {
  alert("Please login to use the app.");
  window.location.href = "/login.html"; // redirect if not logged in
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    alert("You've been logged out!");
    window.location.href = "http://localhost:3000/login.html";
  });
  


function removeMarkInProgressButton(card) {
  const btn = card.querySelector(".mark-in-progress");
  if (btn) btn.remove();
}

function addMarkInProgressButton(card) {
  const footer = card.querySelector(".card-footer");
  if (!footer || card.querySelector(".mark-in-progress")) return;

  const button = document.createElement("button");
  button.textContent = "Mark as In Progress";
  button.classList.add("mark-in-progress");

  button.addEventListener("click", async function () {
      const inProgressColumn = Array.from(document.querySelectorAll(".column")).find(column =>
          column.querySelector("h2").textContent.trim() === "In Progress"
      );
      if (!inProgressColumn) return;

      const inProgressContainer = inProgressColumn.querySelector(".cards-container");
      inProgressContainer.appendChild(card);
      removeMarkInProgressButton(card);

      const id = card.getAttribute("data-id");
      if (id) {
        await fetch("http://localhost:3000/api/todos/move", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ id, column: "In Progress" })
          });
      }
  });

  footer.prepend(button);
}


document.addEventListener("DOMContentLoaded", function () {
    /*

    The DOMContentLoaded event fires when the HTML document has been completely parsed, and 
    all deferred scripts (<script defer src="…"> and <script type="module">) have downloaded and
     executed. It doesn't wait for other things like images, subframes, and async scripts to finish loading.

    */

    async function addCard(cardContainer) {
        const taskTitle = await createModernPrompt("Enter Task Title:");
        if (!taskTitle) return;

        const priorityInput = await createModernPrompt(
            "Enter Priority - low, medium, urgent:",
        );
        if (!priorityInput) return;
        const priority = priorityInput.toLowerCase();

        const validPriorities = ["low", "medium", "urgent"];
        if (!validPriorities.includes(priority)) {
            /* The includes() method of String values performs a case-sensitive search to 
            determine whether a given string may be found within this string, returning true or false as appropriate.
            also used for array.includes() 
            */
            alert("Invalid priority! Please enter low, medium, or urgent.");
            return;
        }

        const columnElement = cardContainer.closest(".column"); // Detect which column the card is being created under
        const columnName = columnElement.querySelector("h2").textContent.trim();
        const response = await fetch("http://localhost:3000/api/todos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ title: taskTitle, priority, column: columnName })
          });
          
        const result = await response.json();
          
          if (!response.ok) {
            alert("Failed to add task to backend: " + result.message);
            return;
          }
          
          // ✅ Now use the task data from backend
          const taskId = result.todo._id;
          
        // Create new card element
        const card = document.createElement("div");
        card.setAttribute("data-id", taskId);

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
         (e.g., it sets draggedCard to the card you're dragging).
         The value of this attribute is set dynamically based on the variable priority (which was input by the user, such as "low", "medium", or "urgent").

         <div class="card" data-priority="urgent"></div>


        */

        card.setAttribute("data-priority", priority);

        /*   setAttribute("data-priority", priority) adds a data-* attribute, where * can be any name (here, priority).
        priority comes from the user's input earlier in the addCard function (e.g., prompt("Enter Priority...")).
        data-* attributes are a way to store custom data on HTML elements that your JavaScript can use later.

        This stores the card's priority (e.g., "urgent") directly on the element. Later, when you drag the card
         between columns, your code can check this attribute to restore the priority label if needed (e.g., in restorePriorityAndRemoveDelete).
        */

        // Card Header
        const cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header");

        const cardTitle = document.createElement("h3");
        cardTitle.addEventListener("click", () => openCardModal(card));
        cardTitle.textContent = taskTitle;

        const cardPriority = document.createElement("span");
        cardPriority.classList.add("priority", priority);
        /*
        This line adds two CSS classes to the cardPriority element: "priority" and the value of the priority variable (e.g., "urgent").
        How It Works:
        cardPriority is a <span> element you created earlier with document.createElement("span").
        classList.add() is a method that lets you add one or more classes to an element's class attribute.
        Here, it adds:
        "priority": A base class, likely for general styling of all priority labels (e.g., font size, padding).
        priority: The specific priority value (e.g., "low", "medium", or "urgent"), which comes from the user's 
        input in the prompt. This could be used for specific styling (e.g., red for "urgent").

        <span class="priority urgent">Urgent</span>



        */
        cardPriority.textContent =
            priority.charAt(0).toUpperCase() + priority.slice(1);
        cardPriority.setAttribute("data-priority-span", "true");

        /*

        priority.charAt(0).toUpperCase()
        Takes the first character of the priority string ("urgent" → "u") and capitalizes it ("u" → "U").

        priority.slice(1)
        Extracts the remaining characters from position 1 onward ("urgent" → "rgent").

        Concatenates these two results to form a properly capitalized string ("Urgent").

        */

        cardHeader.appendChild(cardTitle);
        cardHeader.appendChild(cardPriority);

        // Card Footer
        const cardFooter = document.createElement("div");
        cardFooter.classList.add("card-footer");

        const dateElement = document.createElement("p");
        dateElement.classList.add("date");
        const currentDate = new Date(); // Creates a JavaScript Date object, representing the exact current date and time when this code is executed.
        dateElement.textContent = currentDate.toLocaleDateString("en-US", { 
            month: "long",
            day: "2-digit",
            year: "numeric",
        });
        /*

        .toLocaleDateString() is a built-in JavaScript method used to convert a Date object into a readable date string based on locale-specific formatting.
        dateObject.toLocaleDateString(locale, options);
        locale (optional)
        Specifies the language/culture to format the date for (e.g., "en-US", "en-GB", "fr-FR").
        Output (depends on user's locale):
        3/21/2025 (U.S.) or 21/03/2025 (Europe)

         options (optional)
         An object specifying additional formatting details (e.g., month, day, year).
         "en-US" → "March 21, 2025" (Month-Day-Year, English)
         "en-GB" → "21 March 2025" (Day-Month-Year, British English)
         "fr-FR" → "21 mars 2025" (Day-Month-Year, French)

         Common options used:
         Option	Values	Example Output
         year	"numeric", "2-digit"	"2025" or "25"
         month	"numeric", "2-digit", "short", "long"	"3", "03", "Mar", "March"
         day	"numeric", "2-digit"	"5", "05"
         weekday	"long", "short", "narrow"	"Monday", "Mon", "M"

        */

         const timeElement = document.createElement("p");
    timeElement.classList.add("time");
    timeElement.setAttribute("data-timestamp", currentDate.getTime());
    timeElement.textContent = "Just now";

    cardFooter.appendChild(dateElement);
    cardFooter.appendChild(timeElement);

    // ✅ Conditionally add "Mark as In Progress" if NOT created in In Progress or Finished
    if (columnName !== "In Progress" && columnName !== "Finished") {

  if (!card.querySelector(".mark-in-progress")) {
    const button = document.createElement("button");
        button.textContent = "Mark as In Progress";
        button.classList.add("mark-in-progress");

        button.addEventListener("click", async function () {
            const inProgressColumn = Array.from(document.querySelectorAll(".column")).find(column =>
                column.querySelector("h2").textContent.trim() === "In Progress"
            );
            if (!inProgressColumn) return;

            const inProgressContainer = inProgressColumn.querySelector(".cards-container");
            inProgressContainer.appendChild(card);
            this.remove();

            const id = card.getAttribute("data-id");
            if (id) {
                await fetch("http://localhost:3000/api/todos/move", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ id, column: "In Progress" })
                });
            }
        });

        cardFooter.prepend(button);

  }
        
    }

    // Add card to UI
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
    /*

    Select all elements with .add-new class
    → These are usually "Add Task" buttons inside each column.

    Loop through each button
    → Attach a click listener to each one.

    On click:

    event.target.closest(".column"):
    Finds the column (i.e., the vertical block) the button belongs to. This ensures each button adds a card to the right place.
    column.querySelector(".cards-container"):
    Inside that column, it finds the <div> meant to hold all the cards.
    addCard(cardContainer):
    Calls your card-creation function and adds the new card to the correct column.


    */

    function updateTimeAgo() {
        document.querySelectorAll(".time").forEach((timeElement) => {
            const timestamp = timeElement.getAttribute("data-timestamp");
            if (!timestamp) return;

            /*
            so with coumnet.queySelectorAll(".time") - we are selecting
            all the <p> tags with class "time". then we say that for 
            every .time element run a function under which-
            timeELement.getAttribute("data-timestamp") - this grabs the value 
            stored in data-timestamp attribute of that p tag. 


            */

            const timeDiff = Math.floor((Date.now() - timestamp) / 1000);

            // math.floor rounds a number down to the nearest integer 

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

    async function handleDrop(event) {
      event.preventDefault();
      const dropTarget = event.target.closest(".cards-container");
      if (!dropTarget || !draggedCard) return;
  
      dropTarget.appendChild(draggedCard);
      dropTarget.classList.remove("drag-over");
  
      const columnTitle = dropTarget
          .closest(".column")
          .querySelector("h2")
          .textContent.trim();
  
      const id = draggedCard.getAttribute("data-id");
  
      // 🧹 Always remove old button + delete state
      restorePriorityAndRemoveDelete(draggedCard);
      removeMarkInProgressButton(draggedCard);
  
      // ✅ Add delete button if moved to "Finished"
      if (columnTitle === "Finished") {
          removePriorityAndAddDelete(draggedCard);
  
          // Optional: Mark status = done in backend
          if (id) {
            const response = await fetch("http://localhost:3000/api/todos/delete", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ id })
              });              
          }
      }
  
      // ✅ If moved to any column EXCEPT "In Progress" and "Finished", add "Mark as In Progress"
      if (columnTitle !== "In Progress" && columnTitle !== "Finished") {
          addMarkInProgressButton(draggedCard);
      }
  
      // ✅ Always update backend with new column
      if (id) {
          await fetch("http://localhost:3000/api/todos/move", {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                   Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ id, column: columnTitle })
          });
      }
  }
  

      function calculateTimeAgo(date) {
        const secondsAgo = Math.floor((Date.now() - date.getTime()) / 1000);
      
        if (secondsAgo < 60) return "Just now";
        if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} mins ago`;
        if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`;
        return `${Math.floor(secondsAgo / 86400)} days ago`;
      }
      

      async function loadAndRenderTasks() {
        const response = await fetch("http://localhost:3000/api/todos", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        const result = await response.json();
        const todos = result.todos;
    
       
       //  console.log("Rendering todos from MongoDB:", todos);  //debugging currently will remove once issue found
    
    
        todos.forEach(todo => {
            const columnName = todo.column || (todo.status ? "Finished" : "To Do");
    
            const column = Array.from(document.querySelectorAll(".column")).find(col =>
                col.querySelector("h2").textContent.trim() === columnName
            );
    
            const cardContainer = column.querySelector(".cards-container");
    
            const card = document.createElement("div");
            card.classList.add("card");
            card.setAttribute("draggable", "true");
            card.setAttribute("data-id", todo._id);
            card.setAttribute("data-priority", todo.priority); 
    
            const cardHeader = document.createElement("div");
            cardHeader.classList.add("card-header");
    
            const cardTitle = document.createElement("h3");
            cardTitle.textContent = todo.title;
    
            const cardPriority = document.createElement("span");
            cardPriority.classList.add("priority", todo.priority);
            cardPriority.textContent = todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1);
            cardPriority.setAttribute("data-priority-span", "true");
    
            cardHeader.appendChild(cardTitle);
            cardHeader.appendChild(cardPriority);
    
            const cardFooter = document.createElement("div");
            cardFooter.classList.add("card-footer");
    
            const date = new Date(todo.createdAt);
    
            const dateElement = document.createElement("p");
            dateElement.classList.add("date");
            dateElement.textContent = date.toLocaleDateString("en-US", {
                month: "long",
                day: "2-digit",
                year: "numeric",
            });
    
            const timeElement = document.createElement("p");
            timeElement.classList.add("time");
            timeElement.setAttribute("data-timestamp", date.getTime());
            timeElement.textContent = calculateTimeAgo(date);
    
            cardFooter.appendChild(dateElement);
            cardFooter.appendChild(timeElement);
    
            // if not finished, add in-progress button
         
            if (!todo.status && todo.column === "To Do") {
              if (!card.querySelector(".mark-in-progress")) {
                const button = document.createElement("button");
                button.textContent = "Mark as In Progress";
              
                button.addEventListener("click", async function () {
                  const inProgressColumn = Array.from(document.querySelectorAll(".column")).find(column =>
                    column.querySelector("h2").textContent.trim() === "In Progress"
                  );
                  if (!inProgressColumn) return;
                  const inProgressContainer = inProgressColumn.querySelector(".cards-container");
                  inProgressContainer.appendChild(card);
                  button.remove();
              
                  //  persist to backend
                  const id = card.getAttribute("data-id");
                  if (id) {
                    await fetch("http://localhost:3000/api/todos/move", {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json", Authorization: `Bearer ${token}`
                      },
                      body: JSON.stringify({ id, column: "In Progress" })
                    });
                  }
                });
              
                cardFooter.prepend(button);

              }
                
              } else {
                removePriorityAndAddDelete(card);
            }
    
            card.appendChild(cardHeader);
            card.appendChild(cardFooter);
            cardContainer.appendChild(card);
    
            card.addEventListener("dragstart", handleDragStart);
        });
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
      
          deleteBtn.addEventListener("click", async () => {
            const id = card.getAttribute("data-id");
      
            if (!id) {
              alert("No ID found on card");
              return;
            }
      
            const response = await fetch("http://localhost:3000/api/todos/delete", {
              method: "POST",
              headers: {
                "Content-Type": "application/json", Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ id }) 
              /*
              MongoDB ObjectIds are not integers, so parseInt(id) returns NaN, then backend tries to findById(NaN), that crashes with 500 error
              hence we pass this as string - since we made this change here we reflect on backend for post /delete route to expect a string ID

              */
            });
      
            const result = await response.json();
      
            if (response.ok) {
              card.remove(); // ✅ remove from UI
              console.log("Deleted from backend:", result);
            } else {
              alert("Failed to delete: " + result.message);
            }
          });
      
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

    loadAndRenderTasks();
});
