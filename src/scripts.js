//DOM Manipulation and Event Listeners

// DOMContentLoaded event for generating passwords
document.addEventListener('DOMContentLoaded', () => {
    const generatePasswordForm = document.getElementById('generate-password-form');
    const passwordList = document.getElementById('password-list');

    generatePasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(generatePasswordForm);
        const title = formData.get('title');
        const description = formData.get('description');
        const start_date = formData.get('start_date');
        const end_date = formData.get('end_date');

        try {
            const newPassword = await AJAX('/api/passwords', { title, description, start_date, end_date }, 'POST');

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

            generatePasswordForm.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });
});

// Function to delete password
async function deletePassword(passwordId) {
    if (confirm('Are you sure you want to delete this password?')) {
        try {
            const response = await AJAX(`/api/passwords/${passwordId}`, undefined, 'DELETE');

            if (response.ok) {
                document.getElementById(passwordId).remove();
            } else {
                throw new Error('Failed to delete password');
            }
        } catch (error) {
            console.error('Error deleting password:', error);
        }
    }
}

// DOMContentLoaded event for login form
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await AJAX('/api/login', { email, password }, 'POST');

            if (!response.ok) {
                throw new Error(response.message || 'Login failed');
            }

            localStorage.setItem('token', response.token);
            window.location.href = '/profile.html'; // Redirect upon successful login
        } catch (error) {
            console.error('Login error:', error.message);
        }
    });
});

// DOMContentLoaded event for registration form
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(registerForm);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await AJAX('/api/register', { username, email, password }, 'POST');

            if (!response.ok) {
                throw new Error(response.message || 'Registration failed');
            }

            console.log('User registered successfully:', response);
            window.location.href = '/sign-in.html'; // Redirect upon successful registration
        } catch (error) {
            console.error('Registration error:', error.message);
        }
    });
});

// DOMContentLoaded event for password change form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('passwordChangeForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await AJAX('/api/change-password', { email, newPassword }, 'POST');

            if (response.success) {
                alert('Password changed successfully!');
                window.location.href = '/sign-in.html'; // Redirect to Sign In page
            } else {
                throw new Error('Failed to change password: ' + response.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while changing the password.');
        }
    });
});

// DOMContentLoaded event for fetching initial passwords
document.addEventListener('DOMContentLoaded', () => {
    fetchPasswords();
});

// Function to fetch passwords
async function fetchPasswords() {
    try {
        const response = await AJAX('/api/passwords');

        if (!response.ok) {
            throw new Error('Failed to fetch passwords');
        }

        const passwordList = document.getElementById('password-list');
        response.forEach(password => {
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
    }
});

// Function to handle password change
function handleChangePassword(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    AJAX('/api/change-password', { email, newPassword }, 'POST')
        .then(response => {
            if (response.success) {
                alert('Password changed successfully!');
                window.location.href = '/sign-in.html'; // Redirect to Sign In page
            } else {
                throw new Error('Failed to change password: ' + response.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while changing the password.');
        });
}

// Function to attach delete event listeners
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
