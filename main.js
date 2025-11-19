const data = [
    { title: "Купить продукты на неделю", isDone: false },
    { title: "Полить цветы", isDone: true },
    { title: "Сходить на тренировку", isDone: false },
];

const root = document.getElementById("root");

const titleEl = document.createElement('h1');
titleEl.textContent = "Music App";
root.append(titleEl);

const ulEl = document.createElement("ul");

data.forEach(function ({ title, isDone }) {
    const liEl = document.createElement("li");
    liEl.innerHTML = `
       <span>${title}</h1>
       <input type="checkbox" ${isDone ? "checked" : ""}/>
    `;

    ulEl.append(liEl);
});

root.append(ulEl);
