const express = require('express');
const app = express();
const sql = require('mssql');

// Настройки подключения к базе данных
const config = {
    user: 'sa',
    password: '143',
    server: '194.0.88.126',
    port: 1433,
    database: 'users_db',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

// Подключение к базе данных
sql.connect(config)
    .then(() => console.log('Подключение к базе данных успешно!'))
    .catch((err) => console.error('Ошибка подключения к базе данных:', err));

// Middleware для обработки данных
app.use(express.urlencoded({ extended: true })); // Для формы
app.use(express.json()); // Для JSON

// Обработчик POST-запроса
app.post('/addUser', (req, res) => {
    const { username, email, password } = req.body;

    // Проверяем, что все данные заполнены
    if (!username || !email || !password) {
        return res.status(400).send('Все поля должны быть заполнены!');
    }

    // SQL-запрос для добавления пользователя
    const query = `INSERT INTO dbo.users (username, email, password) VALUES (@username, @email, @password)`;

    // Выполняем запрос
    const request = new sql.Request();
    request
        .input('username', sql.NVarChar(255), username)
        .input('email', sql.NVarChar(255), email)
        .input('password', sql.NVarChar(255), password)
        .query(query)
        .then(() => {
            console.log(`Добавлен пользователь: ${username}, ${email}`);
            res.send('Пользователь успешно добавлен');
        })
        .catch((err) => {
            console.error('Ошибка при добавлении пользователя:', err);
            res.status(500).send('Ошибка при добавлении пользователя');
        });
});

// Обслуживание HTML файлов
app.use(express.static('docs'));

const port = 3000;
app.listen(port, () => {
    console.log(`Сервер работает на http://localhost:${port}`);
});