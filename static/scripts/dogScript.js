    async function deleteDog(animalId) {
        try {
            const confirmDelete = confirm('Ты уверен что хочешь удалить животное?');
            if (confirmDelete) {
                const response = await fetch(`/api/animal/deleteAnimal/${animalId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    window.location.href = '/';

                } else {
                    console.error('Failed to delete dog');
                }
            }
        } catch (error) {
            console.error('Error deleting dog:', error);
        }
    }
    
    async function getMedicalRecordData(dogId) {
        const response = await fetch(`/getMedicalRecord/${dogId}`);
        const medicalRecord = await response.json();
        return medicalRecord;
      }
    
    function openUpdateForm() {      
        const dogDetails = document.querySelector('.details');        

        const dogName = dogDetails.querySelector('h2').textContent.trim();
        
        const dogAge = findListItem("Возраст:");
        const dogBreed = findListItem("Порода:");
        const dogColor = findListItem("Цвет:");
        const dogCoatType = findListItem("Тип шерсти:");
        const dogGender = findListItem("Пол:");
        const dogPrice = findListItem("Цена:");
    
        document.getElementById('updateDogForm').elements['name'].value = dogName;
        document.getElementById('updateDogForm').elements['age'].value = dogAge;
        document.getElementById('updateDogForm').elements['breed'].value = dogBreed;
        document.getElementById('updateDogForm').elements['color'].value = dogColor;
        document.getElementById('updateDogForm').elements['coat_type'].value = dogCoatType;
        document.getElementById('updateDogForm').elements['gender'].value = dogGender;
        document.getElementById('updateDogForm').elements['price'].value= parseInt(dogPrice);

        document.getElementById('overlayUpdateForm').style.display = 'block';
        document.getElementById('updateDogModal').style.display = 'block';
        
    }



    function closeUpdateForm() {
        document.getElementById('overlayUpdateForm').style.display = 'none';
        document.getElementById('updateDogModal').style.display = 'none';
    }

function buyAnimal(animalId) {

    const dogName = document.querySelector('.details').querySelector('h2').textContent.trim();
    
    fetch("/api/payment/create-payment-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({animalId:animalId, dogName: dogName }),
  })
    .then(res => {
      if (res.ok) return res.json()
      return res.json().then(json => Promise.reject(json))
    })
    .then(({ url }) => {
      window.location = url;
    })
    .catch(e => {
      console.error(e.error)
    })
}

    document.addEventListener('DOMContentLoaded', () => {
        const token = localStorage.getItem('token');
        
        if (token) {
            const decodedToken = decodeJWT(token);
            document.getElementById('buyButtonContainer').style.display = 'block';
            document.getElementById('UpdateMedicalInfo2').style.display = 'none'

            if (decodedToken.role === 'vet'){
                document.getElementById('UpdateMedicalInfo2').style.display = 'block'
                document.getElementById('buyButtonContainer').style.display = 'none';
            }
            
            if (decodedToken.role === 'admin') {
                document.getElementById('adminButtons').style.display = 'block';
                document.getElementById('UpdateMedicalInfo2').style.display = 'block'
            } 
            else{
                document.getElementById('adminButtons').style.display = 'none';
            }
            
            
        } else {
            document.getElementById('adminButtons').style.display = 'none';
            document.getElementById('buyButtonContainer').style.display = 'none';
            document.getElementById('UpdateMedicalInfo2').style.display = 'none'
            const container = document.getElementById('buttons_container');

            const messageParagraph = document.createElement('p');

            messageParagraph.textContent = 'Для покупки животных войдите в аккаунт';

            container.appendChild(messageParagraph);
            const loginButton = document.createElement('button');
            loginButton.textContent = 'Войти';

            loginButton.addEventListener('click', () => {
                window.location.href = '/login';
            });

            container.appendChild(loginButton);
            
        }
        
    const path = window.location.pathname;
    const parts = path.split('/');
    const animalId = parts[2]

    fetch(`/api/animal/getAnimalDetail/${animalId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch animal detail');
            }
            return response.json();
        })
        .then(animalDetail => {

            document.title = animalDetail.name;
            const detailsContainer = document.querySelector('.details');

            detailsContainer.innerHTML = `
                <h2>${animalDetail.name}</h2>
                <ul>
                    <li><span class="label">Возраст:</span> ${animalDetail.age?? ''}</li>
                    <li><span class="label">Порода:</span> ${animalDetail.breed?? ''}</li>
                    <li><span class="label">Цвет:</span> ${animalDetail.color?? ''}</li>
                    <li><span class="label">Тип шерсти:</span> ${animalDetail.coat_type?? ''}</li>
                    <li><span class="label">Пол:</span> ${animalDetail.gender?? ''}</li>
                    <li><span class="label">Цена:</span> ${animalDetail.price ?? ''} &#8381;</li>
                </ul>
            `;

            const imageElement = document.getElementById('image');
            imageElement.src = `/static/${animalDetail.image_path}`;

        })
        .catch(error => {
            console.error('Error:', error);
        });

        fetch(`/api/medicalRecords/getMedicalRecords/${animalId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch animal detail');
            }
            return response.json();
        })
        .then(medicalRecords => {
            
            const recordsContainer = document.getElementById('UpdateMedicalInfo2');

            recordsContainer.innerHTML = `
            <form id="UpdateMedicalInfo" onsubmit="submitUpdateMedicalInfo(event)">
                <label for="id">ID: </label>
                <input type="text" id="idDog" name="id" value="${animalId ?? ''}" readonly required>
                <br><br>
                <label for="status">Статус здоровья:</label>
                <input type="text" id="updateStatus" name="status" value="${medicalRecords ? medicalRecords.health_status : ''}" required>
                <br><br>
                <label for="vaccinations">Прививки:</label>
                <input type="text" id="updateVaccinations" name="vaccinations" value="${medicalRecords ? medicalRecords.vaccinations : ''}" required>
                <br><br>
                <label for="Date">Дата обновления статуса:</label>
                <input type="text" id="updateDate" name="date" value="${medicalRecords ? medicalRecords.date : ''}" required>
                <br><br>
                <input type="submit" value="Изменить медицинские записи">
            </form>
        `;

        })
        .catch(error => {
            console.error('Error:', error);
        });

        document.getElementById('update_button').addEventListener('click', function() {
            openUpdateForm();
        });
        document.getElementById('delete_button').addEventListener('click', function() {
            deleteDog(animalId);
        });
        document.getElementById('buy_button').addEventListener('click', function() {
            buyAnimal(animalId);
        });
        document.getElementById('updateDogForm').addEventListener('submit', function(event) {
            submitUpdateForm(event, animalId);
        });
    
    });
    
    function decodeJWT(token) {
        return JSON.parse(atob(token.split('.')[1]));
    }
    
const findListItem = function(label) {
    const dogDetails = document.querySelector('.details');        
    var listItems = dogDetails.querySelectorAll("li");
    for (var i = 0; i < listItems.length; i++) {
        var listItem = listItems[i];
        if (listItem.textContent.includes(label)) {
            return listItem.textContent.replace(label, '').trim();
        }
    }
    return null;
}
function submitUpdateForm(event, animalId) {
    event.preventDefault();

    const form = document.getElementById('updateDogForm');
    const formData = new FormData(form);
    const animalData = {
        name: formData.get("name"),
        age: formData.get("age"),
        breed: formData.get("breed"),
        color: formData.get("color"),
        coat_type: formData.get("coat_type"),
        gender: formData.get("gender"),
        price: formData.get("price")

    }
    fetch(`/api/animal/updateAnimal/${animalId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(animalData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dog updated successfully:', data);
        window.location.reload();
        closeUpdateForm();
    })
    .catch(error => console.error('Error updating dog:', error));
}

function submitUpdateMedicalInfo(event) {

        event.preventDefault();

        const form2 = document.getElementById('UpdateMedicalInfo');
        const formData = new FormData(form2);
        const mediucalData = {
            animalId: formData.get('id'),
            medicalStatus: formData.get('status'),
            vaccinations: formData.get('vaccinations'),
            date: formData.get('date')
        };

        fetch(`/api/medicalRecords/updateMedicalRecords`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mediucalData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Dog updated successfully:', data);
            window.location.reload();
        })
        .catch(error => console.error('Error updating dog:', error));
    }

