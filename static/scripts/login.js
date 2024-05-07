document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const userData = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const token = data.token;

            localStorage.setItem('token', token);

            window.location.href = '/';
        } catch (error) {
            console.error('Error:', error);
            responseDiv.textContent = 'Login failed';
        }
    });
});