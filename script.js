const express = require('express');
const app = express();
const sql = require('mssql');

// Настройки подключения к базе данных
const config = {
    user: 'sa',
    password: '12345',
    server: '192.168.0.101', // Замените на IP вашего сервера
    port: 1433, // Указываем порт 1433
    database: 'users_db',
    options: {
        encrypt: true, // Если требуется шифрование
        trustServerCertificate: true, // Для пропуска проверки сертификата
    },
};

// Middleware для обработки данных
app.use(express.urlencoded({ extended: true })); // Для обработки данных из форм
app.use(express.json()); // Для обработки данных в формате JSON

// Обработчик POST-запроса для добавления пользователя
app.post('/addUser', (req, res) => {
    const { username, email, password } = req.body;

    // Проверяем, что все данные заполнены
    if (!username || !email || !password) {
        return res.status(400).send('Все поля должны быть заполнены!');
    }

    // SQL-запрос для добавления пользователя
    const query = `INSERT INTO dbo.users (username, email, password) VALUES (@username, @email, @password)`;

    // Устанавливаем соединение с базой данных
    sql.connect(config).then(pool => {
        const request = pool.request();

        // Вставляем параметры в запрос
        request.input('username', sql.NVarChar(255), username)
            .input('email', sql.NVarChar(255), email)
            .input('password', sql.NVarChar(255), password)
            .query(query)
            .then(result => {
                console.log(`Добавлен пользователь: ${username}, ${email}`);
                res.send('Пользователь успешно добавлен');
            })
            .catch(err => {
                console.error('Ошибка при добавлении пользователя:', err);
                res.status(500).send('Ошибка при добавлении пользователя');
            });
    }).catch(err => {
        console.error('Ошибка подключения к базе данных:', err);
        res.status(500).send('Ошибка подключения к базе данных');
    });
});

// Обслуживание HTML файлов
app.use(express.static('docs'));

const port = 3000;
app.listen(port, () => {
    console.log(`Сервер работает на http://localhost:${port}`);
});