// @ts-check
// Подключаем express
const express = require('express')
// Инициализируем приложение express. Приложение помещается в переменную app
const app = express()

// Подключаем Sequelize и типы полей для модели. Необходимы для работы с базой данных.
const { Sequelize, DataTypes } = require('sequelize')

// Конфигурируем подключение sequelize. Настройки базы данных (БД) устанавливаем свои.
// Получаем сконфигурированный объект sequelize
const sequelize = new Sequelize('animals_ov4_Zoya', 'Zoya_ov4', 'H587ta', {
    host: '109.206.169.221',
    dialect: 'mysql'
});

// Создаем модель данных. Этой модели sequelize сопоставляет аналогичную по структуре таблицу в БД.
// sequelize автоматически создаст таблицу в mysql по имени todos после вызова sequelize.sync() ниже. 
// Поля id, crearedAt, updatedAt в таблицу добавятся автоматически.
const Todo = sequelize.define('Todo', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {})

// Функция проверки подключения к БД
async function sync() {
    // Подключаемся к БД
    await sequelize.authenticate()
    console.log('Successful connection')
    // Синхронизируем БД с моделью. Создаем таблицу todos, если она еще не создана
    await sequelize.sync()
    console.log('Successful sync')
    // Запускаем наше API после успешного коннекта с БД
    start()
}
sync()

// Функция запуска API. Не сработает, если не удалось подключиться к БД
function start() {
    // Далее для приложения app прописываем обработчики, которые будут срабатывать при поступлении
    // запросов на данный сервер. Эти обработчики назыаются маршрутизаторами (роутами). Подробнее про
    // маршрутизацию (роутинг) читам здесь: https://expressjs.com/ru/starter/basic-routing.html
    // app.use запустит переданный в него обработчик для всех типов запросов (GET, POST и все остальные)
    // и всех URL на данном сервере. Например, обработчик сработает и при запросе GET http://localhost:3000/ 
    // и при запросе POST http://localhost:3000/api/todo
    // Для всех запросов будет запущен обработчик express.json(), который будет извлекать из body
    // запроса JSON, распарсиват его в обычный JS объект и сохранять этот объект req.body, к
    // которому мы будем обращаться ниже. JSON в body мы передаем когда делаем fetch запрос из
    // браузерного JavaScript к данному API
    app.use(express.json())
    
    // Роут для чтения всех задач. Этот роут сработает после вызова в браузере fetch('/api/todo')
    app.get('/api/todo', async (req, res) => {
        // Забыли, что такое async/await и Promise? Читаем: https://learn.javascript.ru/async
        // В переменную todos считываем все записи из таблицы todos БД. Делаем это при помощи метода
        // Todo.findAll(). Т.к. этот метод возвращает Promise мы обязаны поставить перед ним await
        // Пример значения, попадающего в todos можно посмотреть в файле todos.example.json
        // В todos в итоге будет массив с задачами. Каждая задача это в свою очередь объект.
        const todos = await Todo.findAll()
        // Посылаем задачи обратно в браузер
        res.send(todos)
    })

    // Роут для создания задачи. Этот роут сработает после вызова в браузере fetch('/api/todo') с
    // методом POST
    app.post('/api/todo', async (req, res) => {
        // Значение из req.body передаем в переменную newTodo. Это данные новой задачи.
        const newTodo = req.body
        // Записываем задачу в БД
        const todo = await Todo.create(newTodo)
        // Посылаем созданную запись в БД обратно в браузер. Пример такой записи можно увидеть в
        // файле todo.example.json
        res.send(todo)
    })

    
    app.get('/api/todo/:id', async (req, res) => {
        const todo = await Todo.findByPk(req.params.id)
        // Посылаем задачи обратно в браузер
        res.send(todo)
    }) 


    app.patch('/api/todo/:id', async (req, res) => {
        const id = req.params.id
        const patchTodo = req.body
        const todo = await Todo.update(patchTodo, {
            where: {
                id: id
            }
        })
        res.send({
            message: "Successful update"
        })
    })
    
    app.delete('/api/todo/:id', async (req, res) => {
        const id = +req.params.id
        await Todo.destroy({
            where: {
                id: id
            }
        })
        res.send({
            message: "Successful destroy"
        })
    })
    
    // ############################################################################################
    // Здесь необходимо дописать свои роуты для чтения одной задачи, редактирования задачи и
    // удаления задачи. Необходимо опираться на тот код, который мы писали ранее.
    // ############################################################################################

    // Роут для статичного сервера. Если ни один из роутов выше не сработал, то express пытается
    // найти по URL файл, который возможно есть в папке './client'. Например, запрос на URL
    // http://localhost:3000/script.js приведет к тому, что данный роут сработает и обратно в
    // браузер будет отдан файл script.js
    app.use(express.static('./client'))

    // Запускаем сервер на 3000 порту
    app.listen(3000, () => {
        console.log(`Server started at http://localhost:${3000}`)
    })
}