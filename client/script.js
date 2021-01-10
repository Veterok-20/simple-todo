// @ts-check
// Скрипт запускается сразу после загрузки нашей страницы в браузер
// Создаем переменную root в которой будет ссылка на DOM елемент (html элемент) с id="root"
const root = document.getElementById('root')

// Запускаем функцию отрисовки списка дел в элемент root
drawMainPage()

/**
 * Функция отрисовки списка дел. Функция асинхронная (async), поскольку в ней мы делаем запрос на сервер с
 * помощью метода fetch. Запомните, если надо сделать fetch, то надо делать для этого асинхронную
 * функцию. fetch возвращает Promise. Перед всеми прромисами в асинхронной функции мы обязаны писать
 * await. Это как бы ставит функцию на паузу, пока промис после await не выполнится до конца.
 */
async function drawMainPage() {
    // Делаем запрос за списком дел в наше API на express сервере
    const response = await fetch('/api/todo')
    // Если статус код Http ответа сервера равен 200
    if (response.ok) {
        // То распарсиваем полученный с сервера список дел с помощью функции response.json(). 
        // Т.к. она тоже возвращает промис, то перед ней мы обязаны написать await
        // В переменной todos будет находиться массив со списком дел. Пример того, как выглядит
        // такой массив можно ознакомиться в файле todos.example.json
        const todos = await response.json()
        // Далее будет использоваться большое количество стандартных функций по взаимодействию с DOM
        // элементами на странице в браузере. Они позволяют создавать, редактировать и удалять html
        // элементы на страницах в браузере. Более подробно здесь: https://learn.javascript.ru/document
        // Алгоритм работы с DOM элементами всегда примерно один:
        //   1. Находим элемент на странице (querySelector) или создаем новый (createElement)
        //   2. Проводим манипуляции с элементом (меняем свойства, аттрибуты, добавляем обработчики и т.д.)
        //   3. Если элемент еще не добавлен в DOM дерево, то добавляем
        
        // Перед тем как что-то делать с DOM элементом его необходимо создать.
        // Создаем div элемент, в котором будет отображаться список дел
        const todoList = document.createElement('div')
        // Добавляем для элемента аттрибут class="todo-list". По этому классу мы можем стилизовать
        // список дел в css. Используем для этого в css файле селектор .todo-list
        todoList.className = 'todo-list'
        // Запускаем обычный for цикл, который перебирает элементы массива todos
        for (let index = 0; index < todos.length; index++) {
            // В переменной todo будет находиться одна задача из списка дел todos
            // В переменной todo содержится один элемент массива todos под индексом index
            // Пример того, как выглядит содержимое переменной todo можно посмотреть в файле todo.example.json 
            // Видно, что в todo переменной находится простой JS объект, у которого есть свойства с
            // ключами id, name, completed, createdAt, updatedAt. По этим ключам мы будем в
            // дальнейшем извлекать из объекта todo данные о задаче
            const todo = todos[index];
            // Получаем todoElement (это задача todo, но уже в виде html элемента) из функции drawTodoElement
            const todoElement = drawTodoElement(todo)
            // Добавляем todoElement внутрь html элемента todoList
            todoList.append(todoElement)
        }
        // Очищаем root элемент от старого html прежде чем добавлять в него новые элементы
        root.innerHTML = ''
        // Добавляем в элемент root элемент todoList. Список дел должен появиться внутри root
        root.append(todoList)
        // Создаем элемент кнопки, которая будет выводить на экран форму создания новой задачи
        const createTodoButton = document.createElement('button')
        // Добавляем для нее два класса css. Первый класс button можно использовать для всех кнопок
        // в нашем сайте. В селектор .button можно записать стили общие для всех кнопок. Например,
        // шрифт, размеры, скругления и т.д. В селектор .create-todo-button можно записать
        // специфичные стили для кнопки отрисовки формы. Например цвет.
        createTodoButton.className = 'button create-todo-button'
        // Записываем внутрь кнопки текст
        createTodoButton.textContent = 'Create todo'
        // Вешаем на кнопку обработчик клика мышки. Если мы кликнули по кнопке, то запустится
        // стрелочная функция колбек, которая передана вторым параметром в функцию addEventListener
        createTodoButton.addEventListener('click', () => {
            // Запускаем отрисовку внутрь root формы создания новой задачи
            drawCreateTodoForm()
        })
        // Добавляем кнопку внутрь root
        root.append(createTodoButton)
    }
}

/**
 * Функция отрисовки формы создания новой задачи
 */
function drawCreateTodoForm() {
    // Создаем текст с html внутренним содержанием формы
    const formContent = /*html*/`
        <label>Name: <input name="todoname" type="text"/></label>
        <label>Completed: <input name="completed" type="checkbox"/></label>
        <button type="submit">Create</button>
    `
    // Создаем элемент формы
    const form = document.createElement('form')
    // Добавляем к нему css класс todo-form
    form.className = 'todo-form'
    // Заполняем элемент формы html из переменной formContent
    form.innerHTML = formContent
    // Вешаем на форму обработчик события submit. Это событие произойдет, когда внутри формы будет
    // нажата кнопка с type="submit".
    form.addEventListener('submit', event => {
        // Т.к. событие submit приводит к тому, что браузер по умолчанию считывает содержимое формы
        // и отправляет его на сервер, при этом перегружая и переадресуя браузер на ссылку,
        // указанную в аттрибуте action, то нам необходимо предотвратить такое поведение, чтобы мы
        // имели возможность работать с формой силами JavaScript. Для этого на объекте события event,
        // которое передается в данный колбек, мы должны вызвать метод preventDefault(). Это
        // предотвратит указанное выше поведение браузера по умолчанию.
        event.preventDefault()
        // Чтобы получить значение input-ов из формы мы можем воспользоваться аттрибутом name,
        // который мы указывали выше для input-ов в форме. Вот как было: <input name="todoname" type="text"/>
        // По этому name мы можем получить значение соответствующего input. Например, приведенный
        // input элемент мы можем получить написав form.todoname
        // Подробнее как через JS работать со значениями форм здесь: https://learn.javascript.ru/form-elements
        const inputTodoName = form.todoname
        // Аналогично для второго input
        const inputCompleted = form.completed
        // Т.к. первый input имеет аттрибут type="text", то это обычный input для ввода текста. Для
        // извлечения из него текста используется свойство value
        const todoname = inputTodoName.value
        // Второй input имеет аттрибут type="checkbox", что значит, что это checkbox элемент. И у
        // него есть только два значения: true или false. Получить их можно с помощью свойства checked
        const completed = inputCompleted.checked
        // Запускаем функцию createTodo, которая отправит на сервер запрос на создание новой задачи,
        // после чего отрисует весь список задач внутрь элемента root
        createTodo(todoname, completed)
    })
    // Создаем кнопку возврата к списку задач
    const backButton = document.createElement('button')
    backButton.className = 'button back-button'
    backButton.textContent = 'Back to main'
    // Делаем обработчик click, который вызовет колбек, внутри которого вызывается функция отрисовки
    // списка задач drawMainPage()
    backButton.addEventListener('click', () => {
        drawMainPage()
    })
    // Перед добавлением контента в root очищаем сам root
    root.innerHTML = ''
    // Добавляем в root кнопку возврата
    root.append(backButton)
    // Добавляем в root форму
    root.append(form)
}

/**
 * Функция отрисовки html элемента с одной задачей. Комментарий ниже просто дает описание
 * параметров, которые передаются в функцию. Синтаксис называется JSDoc.
 * @param {Object} todo Объект задачи, ниже указаны свойства этого объекта
 * @param {number} todo.id Id задачи из базы данных (БД)
 * @param {string} todo.name Текст задачи из БД
 * @param {boolean} todo.completed Выполнена задача или нет
 * @param {string} todo.createdAt Когда задача создана
 * @param {string} todo.updatedAt Когда задача отредактирована
 */
function drawTodoElement(todo) {
    // Создаем todoElement для одной задачи
    const todoElement = document.createElement('div')
    todoElement.className = 'todo'
    // Здесь используем тернарный оператор (один из вариантов условного оператора). Подробнее про
    // тернарный оператор: https://learn.javascript.ru/ifelse#uslovnyy-operator
    // Если задача выполнена, т.е. (todo.completed === true), то textDecoration равен
    // 'line-through', иначе textDecoration равен 'none'
    const textDecoration = todo.completed ? 'line-through' : 'none';
    // Внутрь todoElement добавляем span элемент. К этому span добавляем аттрибут style, который
    // позволяет напрямую применять стили к данному элементу. Здесь в style мы записываем стиль
    // text-decoration, который равен значению из переменной textDecoration. Т.е. текст в этом
    // строчном элементе span будет либо зачеркнутым (если (todo.completed === true)), либо нет
    // Подробно: https://webref.ru/html/attr/style
    todoElement.innerHTML = `<span style="text-decoration: ${textDecoration}">${todo.name}</span> `

    // Создаем кнопку редактирования задачи
    const editButton = document.createElement('button')
    editButton.className = 'button edit-button'
    editButton.textContent = 'Edit'
    // Вешаем на кнопку обработчик, внутри которого вызываем функцию editTodo(todo.id) с id задачи
    // editTodo(todo.id) должна выводить форму редактирования задачи с id равным todo.id
    editButton.addEventListener('click', () => {
        editTodo(todo.id)
    })

    // Создаем кнопку удаления задачи
    const deleteButton = document.createElement('button')
    deleteButton.className = 'button delete-button'
    deleteButton.textContent = 'Delete'
    // Вешаем на кнопку обработчик, внутри которого вызываем функцию deleteTodo(todo.id) с id задачи
    // deleteTodo(todo.id) должна удалять задачу с id равным todo.id
    deleteButton.onclick = function () {
        deleteTodo(todo.id)
    }
    // Добавляем кнопки в todoElement
    todoElement.append(editButton)
    todoElement.append(deleteButton)
    // Возвращаем DOM элемент todoElement
    return todoElement
}

/**
 * Функция создания новой задачи. Отправлет POST запрос с данными для создания новой задачи
 * @param {string} todoname Текст задачи
 * @param {boolean} completed Выполнена задача или нет
 */
async function createTodo(todoname, completed) {
    // Создаем объект новой задачи с ключами name и completed. По этим ключам заносим в объект 
    // данные из аргументов todoname, completed, которые получили в данную функцию.
    // Если забыли как создаются объекты, то вот: https://learn.javascript.ru/object
    const newTodo = {
        name: todoname,
        completed: completed
    }
    // Делаем POST запрос к нашему API с данными новой задачи
    const response = await fetch('/api/todo', {
        // Указываем метод http запроса
        method: 'POST',
        headers: {
            // Указываем, что содержимым body будет json
            'Content-Type': 'application/json'
        },
        // Обязательно превращаем объект новой задачи в строку с помощью функции JSON.stringify()
        // В body можно передавать только строки
        body: JSON.stringify(newTodo)
    })
    // Если статус код Http ответа сервера равен 200 
    if (response.ok) {
        // Запускаем функцию отрисовки списка дел в элемент root
        drawMainPage()
    }
}

/**
 * Функция редактирования задачи по id. Должна сначала запросить задачу с сервера, потом отрисовать форму 
 * редактирования задачи с данными этой задачи в полях формы, а уже потом сделать запрос на API для 
 * редактирования задачи на сервере. Это необходимо сделать вам самостоятельно.
 * @param {number} id Id задачи, которую необходимо отредактировать
 */
function editTodo(id) {
    // Пока просто выводим id задачи в консоль
    console.log(id);
}

/**
 * Функция удаления задачи по id. Должна сначала вывести предупреждение об удалении. Потом если
 * подтвердили, необходимо сделать запрос к API на удаление задачи
 * @param {number} id Id задачи, которую необходимо удалить
 */
function deleteTodo(id) {
    // Пока просто выводим id задачи в консоль
    console.log(id);
}