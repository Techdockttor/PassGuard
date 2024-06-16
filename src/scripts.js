//DOM Manipulation and Event Listeners

function deletePassword(id) {
    if (confirm('Are you sure you want to delete this password?')) {
        fetch(`/api/passwords/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                // Remove password entry from UI
                document.getElementById(id).remove(); // Example: Remove row from table
            } else {
                throw new Error('Failed to delete password');
            }
        })
        .catch(error => console.error('Error deleting password:', error));
    }
}

//login Form
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message || 'Login failed');
            }

            const data = await response.json();
            // Assuming you store the token in localStorage for example
            localStorage.setItem('token', data.token);

            // Redirect to dashboard or any other page upon successful login
            window.location.href = '/profile.html'; // Replace with your desired redirect URL

        } catch (error) {
            console.error('Login error:', error.message);
            // Display error message to user or handle accordingly
        }
    });
});

// SignUp Form

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(registerForm);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message || 'Registration failed');
            }

            const data = await response.json();
            // Optionally, you can redirect to login page or handle registration success
            console.log('User registered successfully:', data);
            // Redirect to login page or display success message
            window.location.href = '/sign-in.html'; // Replace with your desired redirect URL

        } catch (error) {
            console.error('Registration error:', error.message);
            // Display error message to user or handle accordingly
        }
    });
});


// password change form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('passwordChangeForm');
    form.addEventListener('submit', handleChangePassword);
});

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const img = input.nextElementSibling.querySelector('img');
    if (input.type === 'password') {
        input.type = 'text';
        img.src = '/public/images/eye.png';
        img.alt = 'Hide Password';
    } else {
        input.type = 'password';
        img.src = '/public/images/eye-crossed.png';
        img.alt = 'Show Password';
    }
}

function handleChangePassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    fetch('/api/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, newPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Password changed successfully!');
            window.location.href = '/sign-in.html'; // Redirect to Sign In page
        } else {
            alert('Failed to change password: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while changing the password.');
    });
}

//Password Generation by PassGuard
document.addEventListener('DOMContentLoaded', () => {
    const generatePasswordForm = document.getElementById('generate-password-form');
    const passwordList = document.getElementById('password-list');
    const filterForm = document.getElementById('filter-form');

    // Event listener for form submission to generate password
    generatePasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(generatePasswordForm);
        const title = formData.get('title');
        const description = formData.get('description');
        const start_date = formData.get('start_date');
        const end_date = formData.get('end_date');

        try {
            // Make POST request to API to generate password and save data
            const response = await fetch('/api/passwords', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description, start_date, end_date })
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            const newPassword = await response.json();

            // Update the table with the new password
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${newPassword.title}</td>
                <td>${newPassword.description}</td>
                <td>${new Date(newPassword.start_date).toLocaleDateString()}</td>
                <td>${new Date(newPassword.end_date).toLocaleDateString()}</td>
                <td>${newPassword.generatedPassword}</td>
                <td>
                    <div class="button-group">
                        <button class="btn waves-effect waves-light red" onclick="deletePassword('${newPassword._id}')">Delete</button>
                    </div>
                </td>
            `;
            passwordList.appendChild(row);

            // Clear form inputs
            generatePasswordForm.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle error display as needed
        }
    });

    // Event listener for filter form submission
    filterForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const status = document.getElementById('filter_status').value;

        try {
            // Fetch filtered passwords from the server
            const response = await fetch(`/api/passwords?status=${status}`);
            if (!response.ok) {
                throw new Error('Failed to fetch filtered passwords');
            }

            const passwords = await response.json();

            // Clear existing table rows
            passwordList.innerHTML = '';

            // Populate the table with filtered passwords
            passwords.forEach(password => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${password.title}</td>
                    <td>${password.description}</td>
                    <td>${new Date(password.start_date).toLocaleDateString()}</td>
                    <td>${new Date(password.end_date).toLocaleDateString()}</td>
                    <td>${password.generatedPassword}</td>
                    <td>
                        <div class="button-group">
                            <button class="btn waves-effect waves-light red" onclick="deletePassword('${password._id}')">Delete</button>
                        </div>
                    </td>
                `;
                passwordList.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching filtered passwords:', error);
            // Handle error display as needed
        }
    });

    // Fetch initial passwords from API and populate table
    fetchPasswords();
});

async function fetchPasswords() {
    try {
        const response = await fetch('/api/passwords');
        if (!response.ok) {
            throw new Error('Failed to fetch passwords');
        }

        const passwords = await response.json();

        // Populate the table with existing passwords
        const passwordList = document.getElementById('password-list');
        passwords.forEach(password => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${password.title}</td>
                <td>${password.description}</td>
                <td>${new Date(password.start_date).toLocaleDateString()}</td>
                <td>${new Date(password.end_date).toLocaleDateString()}</td>
                <td>${password.generatedPassword}</td>
                <td>
                    <div class="button-group">
                        <button class="btn waves-effect waves-light red" onclick="deletePassword('${password._id}')">Delete</button>
                    </div>
                </td>
            `;
            passwordList.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching passwords:', error);
        // Handle error display as needed
    }
}

// Delete Generated Password
function attachDeleteEventListeners() {
    const deleteForms = document.querySelectorAll('.delete-form');
    deleteForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const passwordId = form.getAttribute('data-id');
            await deletePassword(passwordId);
        });
    });
}

async function deletePassword(passwordId) {
    const response = await fetch(`/api/delete-password/${passwordId}`, {
        method: 'DELETE'
    });
  
    if (response.ok) {
        // Remove the password row from the table
        const row = document.querySelector(`
                    <td>${data.title}</td>
                    <td>${data.description}</td>
                    <td>${data.start_date}</td>
                    <td>${data.end_date}</td>
                    <td>${data.generatedPassword}</td>
                    <td>
                      <button class="btn waves-effect waves-light red" onclick="deletePassword('${data._id}')">Delete</button>
                    </td>`);
        if (row) {
            row.remove();
        }
    } else {
        const data = await response.json();
        console.error(data.message);
    }
  }
