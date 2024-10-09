const correctUsername = 'muhammadanas';
const correctPassword = 'anas123';
let totalBudget = 0;

document.getElementById('login-button').onclick = function() {
    showLoading();
    
    setTimeout(() => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === correctUsername && password === correctPassword) {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('budget-form').style.display = 'block';
            document.getElementById('history').style.display = 'block';
            loadHistory();

            // Clear username and password inputs after successful login
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        } else {
            document.getElementById('login-error').innerText = 'Invalid username or password.';
        }
        hideLoading();
    }, 1000);
};

document.getElementById('set-budget-button').onclick = function() {
    showLoading();
    
    const budgetInput = document.getElementById('total-budget').value;
    if (budgetInput) {
        totalBudget = parseFloat(budgetInput);
        updateRemainingBudget();
        document.getElementById('total-budget').value = '';
    }
    hideLoading();
};

document.getElementById('add-button').onclick = function() {
    showLoading();
    
    const itemName = document.getElementById('item-name').value;
    const itemValue = document.getElementById('item-value').value;

    if (itemName && itemValue) {
        const itemValueNum = parseFloat(itemValue);
        totalBudget -= itemValueNum;

        const item = {
            name: itemName,
            value: itemValueNum,
            date: formatDate(new Date()) // Use custom date format function
        };

        let history = JSON.parse(localStorage.getItem('budgetHistory')) || [];
        history.push(item);
        localStorage.setItem('budgetHistory', JSON.stringify(history));
        document.getElementById('item-name').value = '';
        document.getElementById('item-value').value = '';
        loadHistory();
        updateRemainingBudget();
    }
    hideLoading();
};

function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options).replace(/\//g, '-'); // Replace slashes with dashes
}

function updateRemainingBudget() {
    document.getElementById('remaining-budget').innerText = `Remaining Budget: ₹${totalBudget.toFixed(2)}`;
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

document.getElementById('toggle-password').onclick = function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
};

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('budgetHistory')) || [];
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    history.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.date}: ${item.name} - ₹${item.value}`;
        
        const editIcon = document.createElement('span');
        editIcon.textContent = '🖋️';
        editIcon.style.cursor = 'pointer';
        editIcon.onclick = function() {
            editItem(index);
        };

        const deleteIcon = document.createElement('span');
        deleteIcon.textContent = '❌'; 
        deleteIcon.style.cursor = 'pointer';
        deleteIcon.onclick = function() {
            deleteItem(index);
        };

        li.appendChild(editIcon);
        li.appendChild(deleteIcon);
        historyList.appendChild(li);
    });
}

function deleteItem(index) {
    let history = JSON.parse(localStorage.getItem('budgetHistory')) || [];
    totalBudget += history[index].value; // Add the deleted item's value back to totalBudget
    history.splice(index, 1); // Remove the item from the history
    localStorage.setItem('budgetHistory', JSON.stringify(history)); // Update localStorage
    loadHistory(); // Refresh history display
    updateRemainingBudget(); // Update remaining budget display
}

function editItem(index) {
    let history = JSON.parse(localStorage.getItem('budgetHistory')) || [];
    const item = history[index];
    
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-value').value = item.value;

    // Remove the item from history to allow for update
    deleteItem(index);
}

document.getElementById('logout-button').onclick = function() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('budget-form').style.display = 'none';
    document.getElementById('history').style.display = 'none';
    document.getElementById('login-error').innerText = '';
    
    // Clear username and password inputs on logout
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    totalBudget = 0; // Reset total budget
    updateRemainingBudget(); // Reset remaining budget display
    localStorage.removeItem('budgetHistory'); // Clear history on logout
};

document.getElementById('clear-history-button').onclick = function() {
    if (confirm("Are you sure you want to clear all history?")) {
        localStorage.removeItem('budgetHistory'); // Clear history from localStorage
        loadHistory(); // Refresh history display
        totalBudget = 0; // Reset total budget
        updateRemainingBudget(); // Update remaining budget display
    }
};

// Function to display today's date
function displayTodayDate() {
    const today = new Date();
    const formattedDate = formatDate(today);
    document.getElementById('today-date').innerText = `Today's Date: ${formattedDate}`;
}

// Call the function to display the date on page load
displayTodayDate();
