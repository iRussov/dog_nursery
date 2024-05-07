

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'client' NOT NULL
);

------------------------
CREATE TABLE Employees (
    employee_id SERIAL PRIMARY KEY,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    patronymic VARCHAR(50) NOT NULL,
    address VARCHAR(100),
    position VARCHAR(50),
    image_path VARCHAR(255),
    salary INTEGER,
    user_id INTEGER REFERENCES Users(user_id)
);

CREATE TABLE Animals (
    animal_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    age INTEGER,
    breed VARCHAR(50),
    color VARCHAR(50),
    coat_type VARCHAR(50),
    gender VARCHAR(10),
    owner VARCHAR(100),
    image_path VARCHAR(255),
    cost DECIMAL(10, 2),
    description TEXT
);

CREATE TABLE Puppies (
    puppy_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    age INTEGER,
    mom_id INTEGER REFERENCES Animals(animal_id),
    dad_id INTEGER REFERENCES Animals(animal_id),
    gender VARCHAR(10),
    veterinarian_id INTEGER REFERENCES Employees(employee_id),
    image_path VARCHAR(255),
    cost DECIMAL(10, 2),
    description TEXT
);

CREATE TABLE Clients (
    client_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(100),
    user_id INTEGER REFERENCES Users(user_id)
);

CREATE TABLE Applications (
    application_id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES Clients(client_id),
    animal_id INTEGER REFERENCES Animals(animal_id),
    puppy_id INTEGER REFERENCES Puppies(puppy_id),
    application_date DATE
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    ispositive BOOLEAN,
    review TEXT
);

CREATE TABLE medical_records (
    medical_record_id SERIAL PRIMARY KEY,
    animal_id INTEGER NOT NULL,
    vaccinations TEXT,
    health_status TEXT,
    date DATE NOT NULL,
    CONSTRAINT fk_animal_id FOREIGN KEY (animal_id) REFERENCES Animals(animal_id)
);

INSERT INTO public.medical_records(
 animal_id, vaccinations, health_status, date)
 VALUES (2, 'Бешенство , Чума, Гепатит, Парвовирус II типа, Аденовирус I и II типа', 'Отличное', '28.04.2024');

INSERT INTO Employees (last_name, first_name, patronymic, address, position, salary)
VALUES
    ('Иванов', 'Иван', 'Иванович', 'ул. Ленина, 1', 'Менеджер', 60000),
    ('Петрова', 'Анна', 'Сергеевна', 'пр. Октября, 25', 'Заместитель Менеджера', 50000),
    ('Смирнов', 'Дмитрий', 'Александрович', 'ул. Пушкина, 10', 'Ветеринар', 70000),
    ('Козлов', 'Елена', 'Петровна', 'пр. Гагарина, 5', 'Смотритель животных', 40000);

INSERT INTO Animals (name, age, breed, color, coat_type, gender, owner, image_path)
VALUES
    ('Барон', 3, 'Лабрадор', 'Черный', 'Короткая', 'М', 'Мария Иванова', '/images/baron.jpg'),
    ('Рекс', 5, 'Боксер', 'Палевый', 'Короткая', 'М', 'Екатерина Смирнова', '/images/rex.jpg'),
    ('Шарик', 2, 'Джек Рассел терьер', 'Белый с коричневыми пятнами', 'Короткая', 'М', 'Ольга Петрова', '/images/sharik.jpg'),
    ('Белла', 4, 'Далматин', 'Черный с белыми пятнами', 'Короткая', 'Ж', 'Александр Иванов', '/images/bella.jpg'),
    ('Тайсон', 3, 'Ротвейлер', 'Черно-рыжий', 'Короткая', 'М', 'Елена Козлова', '/images/tyson.jpg'),
    ('Луна', 1, 'Ши-тцу', 'Белый', 'Длинная', 'Ж', 'Игорь Смирнов', '/images/luna.jpg'),
    ('Шарли', 6, 'Кавалер Кинг Чарльз спаниель', 'Коричневый', 'Длинная', 'М', 'Марина Петрова', '/images/charlie.jpg'),
    ('Джек', 2, 'Померанский шпиц', 'Оранжевый', 'Длинная', 'М', 'Анна Игорева', '/images/jack.jpg'),
    ('Бадди', 3, 'Лабрадор ретривер', 'Золотой', 'Короткая', 'М', NULL, '/images/buddy.jpg'),
    ('Санни', 5, 'Золотистый ретривер', 'Золотой', 'Длинная', 'Ж', NULL, '/images/sunny.jpg');


INSERT INTO Clients (name, address)
VALUES
    ('Мария Иванова', 'ул. Ленина, 3'),
    ('Екатерина Смирнова', 'пр. Октября, 2'), 
    ('Ольга Петрова', 'ул. Садовая, 10'), 
    ('Александр Иванов', 'пр. Гагарина, 15'),
    ('Елена Козлова', 'ул. Пушкина, 20'),
    ('Игорь Смирнов', 'ул. Мира, 15'), 
    ('Марина Петрова', 'пл. Победы, 7'), 
    ('Анна Игорева', 'ул. Пролетарская, 30'); 

INSERT INTO Puppies (name, age, mom_id, dad_id, gender, veterinarian, image_path)
VALUES
    ('Зайчонок', 1, 4, 7, 'Ж', 'Смирнов Дмитрий Александрович', '/images/puppy1.jpg'),
    ('Медвежонок', 1, 4, 7, 'М', 'Смирнов Дмитрий Александрович', '/images/puppy2.jpg');
    
INSERT INTO Applications (client_id, animal_id, application_date)
VALUES
    (1, 1, '2023-12-01'),  -- Application for Барон by Иванова Мария
    (2, 2, '2023-12-02'),  -- Application for Рекс by Петров Алексей
    (3, 3, '2023-12-03'),  -- Application for Шарик by Петрова Ольга
    (4, 4, '2023-12-04'),  -- Application for Белла by Иванов Александр
    (5, 5, '2023-12-05'),  -- Application for Тайсон by Козлова Елена
    (6, 6, '2023-12-06'),  -- Application for Луна by Смирнов Игорь
    (7, 7, '2023-12-07'),  -- Application for Шарли by Петрова Марина
    (8, 8, '2023-12-08');  -- Application for Джек by Игорева Анна

CREATE OR REPLACE FUNCTION get_applications_on_date(app_date DATE)
RETURNS TABLE (client_name VARCHAR(50), animal_name VARCHAR(50))
AS $$
DECLARE
    cur_applications CURSOR FOR
        SELECT c.name AS client_name, a.name AS animal_name
        FROM Applications app
        JOIN Clients c ON app.client_id = c.client_id
        JOIN Animals a ON app.animal_id = a.animal_id
        WHERE app.application_date = app_date;
    rec_applications RECORD;
BEGIN
    OPEN cur_applications;

    LOOP
        FETCH cur_applications INTO rec_applications;
        EXIT WHEN NOT FOUND;

        client_name := rec_applications.client_name;
        animal_name := rec_applications.animal_name;
        RETURN NEXT;
    END LOOP;

    CLOSE cur_applications;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION on_insert_applications()
RETURNS TRIGGER AS $$
DECLARE
    new_owner VARCHAR(100);
BEGIN
	IF (SELECT owner FROM Animals WHERE animal_id = NEW.animal_id) IS NULL THEN
    	SELECT name INTO new_owner FROM Clients WHERE client_id = NEW.client_id;
    	UPDATE Animals SET owner = new_owner WHERE animal_id = NEW.animal_id;
   	    RETURN NEW;
	 ELSE
        RAISE EXCEPTION 'Животное уже куплено';
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_insert_applications
AFTER INSERT ON Applications
FOR EACH ROW
EXECUTE FUNCTION on_insert_applications();

CREATE OR REPLACE FUNCTION insert_current_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.application_date := current_date;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_current_date_trigger
BEFORE INSERT ON Applications
FOR EACH ROW
WHEN (NEW.client_id IS NOT NULL AND NEW.animal_id IS NOT NULL)
EXECUTE FUNCTION insert_current_date();