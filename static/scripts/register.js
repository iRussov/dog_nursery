document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(registrationForm);
        const userData = {
            username: formData.get('username'),
            password: formData.get('password'),
            role: formData.get('role')
        };

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const responseData = await response.json();
            console.log(responseData);
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            console.log("success");
            window.location.href = '/login';
        } catch (error) {
            console.error('Error:', error);
            if (response.status === 400) {
                const responseData = await response.json();
                console.error(responseData);
            }
        }
    });
});