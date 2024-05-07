function openAddAnimalForm() {
    document.getElementById('addAnimalFormOverlay').style.display = 'block';
}

function closeAddAnimalForm() {
    document.getElementById('addAnimalFormOverlay').style.display = 'none';
}

function submitAddAnimalForm(event) {
    event.preventDefault();

    const form = document.getElementById('addAnimalForm');
    const formData = new FormData(form);

    fetch('/api/animal/addAnimal', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Animal added successfully:', data);
        closeAddAnimalForm();
        window.location.reload();
    })
    .catch(error => console.error('Error adding animal:', error));
}
function viewDog(id) {
    window.location.href = `/dog/${id}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (token) {
        handleLoggedInUser(token);
    } else {
        handleLoggedOutUser();
    }

    try {
        const reviews = await fetchReviews();
        getReview(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }

    try {
        const animals = await fetchAnimals();
        getAnimals(animals);
    } catch (error) {
        console.error('Error fetching animals:', error);
    }
    document.getElementById('profileButton').addEventListener('click', function() {
        window.location.href = '/messenger';
    });
});

document.getElementById('messengerButton').addEventListener('click', function() {
    document.getElementById('messenger').style.display = 'block';
    document.getElementById('messengerButton').style.display = 'none';
});

document.querySelector(".close-button").addEventListener('click', function() {
    document.getElementById('messenger').style.display = 'none';
    document.getElementById('messengerButton').style.display = 'flex';
});

function handleLoggedInUser(token) {
    const decodedToken = decodeJWT(token);
    addReview(decodedToken.username);

    const isAdmin = decodedToken.role === 'admin';
    document.getElementById('logOut').style.display = 'block';
    document.getElementById('log').style.display = 'none';
    document.getElementById('reg').style.display = 'none';
    document.getElementById('review_form').style.display = 'block';
    document.getElementById('addAnimalButton').style.display = isAdmin ? 'block' : 'none';
    if(decodedToken.role === 'employee'){
        document.getElementById('messengerButton').style.display = 'none';
        document.getElementById('profileButton').style.display = 'block';
    }
    const usernamePlace = document.getElementById('username');
    usernamePlace.textContent = decodedToken.username;
}

function handleLoggedOutUser() {
    document.getElementById('addAnimalButton').style.display = 'none';
    document.getElementById('logOut').style.display = 'none';
    document.getElementById('log').style.display = 'li';
    document.getElementById('reg').style.display = 'li';
    document.getElementById('review_form').style.display = 'none';

    const container = document.getElementById('reviewsContainer');
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = 'Для того, чтобы оставить отзыв войдите в аккаунт';
    container.appendChild(messageParagraph);
}

async function fetchReviews() {
    const response = await fetch('/api/review/getReviews');
    if (!response.ok) {
        throw new Error('Failed to fetch reviews');
    }
    return response.json();
}

async function fetchAnimals() {
    const response = await fetch('/api/animal/getAllAnimals');
    if (!response.ok) {
        throw new Error('Failed to fetch animals');
    }
    return response.json();
}


function decodeJWT(token) {
    return JSON.parse(atob(token.split('.')[1]));
}

const addReview = function(username){
    const reviewForm = document.getElementById('review_form');
    reviewForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(reviewForm);
        const userData = {
            user_name: username,
            review_type: formData.get('review_type'),
            review_text: formData.get('review_text')
        };

        try {
            const response = await fetch('/api/review/addReview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                throw new Error('add review failed');
            }
            const responseData = await response.json();

            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    });
}
const getReview = function(reviews){
        const reviewsList = document.getElementById('reviewsList');
        reviewsList.innerHTML = '';
        reviews.reverse().forEach(review => {
            const listItem = document.createElement('li');
            listItem.classList.add(review.ispositive ? 'positive' : 'negative');
            listItem.innerHTML = `<b>${review.user_name}</b><br><br>${review.review}`;
            reviewsList.appendChild(listItem);
        });
} 
const getAnimals = function(animals){
    const animalList = document.getElementById('animals_blocks');
    let html = '';
     animals.forEach(animal => {
        html += `
            <div class="block" onclick="viewDog('${animal.animal_id}')">
                <img src="../static/${animal.image_path}" alt="${animal.name}" class="img_dog">
                <div class="text">${animal.name}</div>
            </div>
        `;
     }); 
     animalList.innerHTML = html;

}
document.getElementById('logOut').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/';
});
