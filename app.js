let expenses =
JSON.parse(localStorage.getItem("expenses")) || [];
let selectedMonth =
new Date().toISOString().slice(0,7);
const greekMonths = [
    "Ιανουάριος",
    "Φεβρουάριος",
    "Μάρτιος",
    "Απρίλιος",
    "Μάιος",
    "Ιούνιος",
    "Ιούλιος",
    "Αύγουστος",
    "Σεπτέμβριος",
    "Οκτώβριος",
    "Νοέμβριος",
    "Δεκέμβριος"
];
let searchText = "";
let selectedCategory = "Όλα";
render();
updateMonthLabel();

document
.getElementById("monthFilter")
.value = selectedMonth;

document
.getElementById("monthFilter")
.addEventListener("change",(e)=>{

    selectedMonth = e.target.value;

    updateMonthLabel();

    render();

});
const searchInput =
document.querySelector(
    ".search-box input"
);

if(searchInput){

    searchInput.addEventListener(
        "input",
        (e)=>{

            searchText =
                e.target.value.toLowerCase();

            render();
            updateMonthLabel();

        }
    );

}
function addExpense(){

    const category =
        document.getElementById("category").value;

    const amount =
        Number(document.getElementById("amount").value);

    const date =
        document.getElementById("date").value;

    if(!amount || !date) return;

    expenses.push({
        category,
        amount,
        date
    });

    saveData();
    render();

    document.getElementById("amount").value = "";
}

function updateMonthLabel(){

    const [year, month] =
        selectedMonth.split("-");

    document.getElementById(
        "currentMonthLabel"
    ).innerText =

        greekMonths[
            Number(month) - 1
        ] +

        " " +

        year;
}


function deleteExpense(index){

    expenses.splice(index,1);

    saveData();
    render();
}

function saveData(){

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );
}

function render(){

    let total = 0;

    const list =
        document.getElementById("expenses");

    list.innerHTML = "";

    const filteredExpenses =
    expenses.filter(item => {

        const monthMatch =
            item.date.startsWith(
                selectedMonth
            );

        const searchMatch =

            item.category
            .toLowerCase()
            .includes(searchText)

            ||

            (item.note || "")
            .toLowerCase()
            .includes(searchText)

            ||

            item.amount
            .toString()
            .includes(searchText);

        const categoryMatch =

    selectedCategory === "Όλα"

    ||

    item.category === selectedCategory;

return monthMatch &&
       searchMatch &&
       categoryMatch;

    });

const sortedExpenses =
    [...filteredExpenses].sort(
            (a,b) =>
            new Date(b.date) - new Date(a.date)
        );

    sortedExpenses.forEach((item,index)=>{

        total += item.amount;

        list.innerHTML += `
<div class="expense">

    <div class="expense-header">

        <div class="expense-title">
            ${getCategoryIcon(item.category)}
            ${item.category}
        </div>

        <div class="expense-amount">
            ${item.amount.toFixed(2)}€
        </div>

    </div>

    <div class="expense-date">
        ${item.date}
    </div>

    ${
        item.note
        ?
        `<div class="expense-note">
            📝 ${item.note}
        </div>`
        :
        ""
    }

    <div class="expense-actions">

      <button onclick="editExpense(${expenses.indexOf(item)})">
    ✏️
</button>

<button onclick="deleteExpense(${expenses.indexOf(item)})">
    🗑️
</button>

    </div>

</div>
`;
    });

    document.getElementById("total").innerText =
        total.toFixed(2) + "€";

    const entries =
        document.getElementById("entriesCount");

    if(entries){
        entries.innerText =
    filteredExpenses.length;
    }

}
function getCategoryIcon(category){

    switch(category){

        case "Τσιγάρα":
            return "🚬";

        case "Βενζίνη":
            return "⛽";

        case "Σούπερ Μάρκετ":
            return "🛒";

        case "Λογαριασμοί":
            return "💡";

        case "Προσωπικά":
            return "👕";

        default:
            return "📦";
    }
}

const modal =
document.getElementById("expenseModal");

document
.getElementById("addBtn")
.addEventListener("click", () => {

    modal.style.display = "flex";

    document
    .getElementById("modalDate")
    .valueAsDate = new Date();

});

document
.getElementById("cancelBtn")
.addEventListener("click", () => {

    modal.style.display = "none";

});

document
.getElementById("saveBtn")
.addEventListener("click", () => {

    const category =
        document.getElementById("modalCategory").value;

    const amount =
        Number(
            document.getElementById("modalAmount").value
        );

    const date =
        document.getElementById("modalDate").value;

    const note =
        document.getElementById("modalNote").value;

    if(!amount || !date){
        alert("Συμπλήρωσε ποσό και ημερομηνία");
        return;
    }

    if(editingIndex !== null){

    expenses[editingIndex] = {

        category,
        amount,
        date,
        note

    };

    editingIndex = null;

}else{

    expenses.push({

        category,
        amount,
        date,
        note

    });

}

    saveData();
    render();

    modal.style.display = "none";

    document.getElementById("modalAmount").value = "";
    document.getElementById("modalNote").value = "";

});
const navButtons =
document.querySelectorAll(".nav-btn");

const expensesSection =
document.getElementById("expenses");

const statsSection =
document.getElementById("statsSection");
const settingsSection =
document.getElementById("settingsSection");
navButtons.forEach((btn,index)=>{

    btn.addEventListener("click",()=>{

        navButtons.forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        if(index === 0){

            expensesSection.style.display =
                "flex";

            statsSection.style.display =
                "none";

            settingsSection.style.display =
                "none";
        }

        if(index === 1){

            expensesSection.style.display =
                "none";

            statsSection.style.display =
                "block";

            settingsSection.style.display =
                "none";

            renderStats();
        }

        if(index === 2){

            expensesSection.style.display =
                "none";

            statsSection.style.display =
                "none";

            settingsSection.style.display =
                "block";
        }

    });

});
let editingIndex = null;
let expensesChart = null;

function renderChart(totals){

    const canvas =
    document.getElementById(
        "expensesChart"
    );

    if(!canvas) return;

    if(expensesChart){

        expensesChart.destroy();

    }
const topCategory =
Object.entries(totals)
.sort((a,b)=>b[1]-a[1])[0];

const topName = topCategory[0];
const topValue = topCategory[1];

const totalValue =
Object.values(totals)
.reduce((a,b)=>a+b,0);

const topPercent =
Math.round(
    (topValue / totalValue) * 100
);
    expensesChart = new Chart(canvas,{
plugins:[
{
    id:"centerText",

    afterDraw(chart){

        const {ctx} = chart;

        const meta =
        chart.getDatasetMeta(0);

        if(!meta.data.length) return;

        const x =
        meta.data[0].x;

        const y =
        meta.data[0].y;

        ctx.save();

        ctx.textAlign = "center";

        let icon = "📦";

        if(topName === "Τσιγάρα")
            icon = "🚬";

        if(topName === "Βενζίνη")
            icon = "⛽";

        if(topName === "Σούπερ Μάρκετ")
            icon = "🛒";

        if(topName === "Λογαριασμοί")
            icon = "💡";

        if(topName === "Προσωπικά")
            icon = "👕";
let centerColor = "#ffffff";

if(topName === "Τσιγάρα")
    centerColor = "#ff4d4d";

if(topName === "Βενζίνη")
    centerColor = "#ff7a00";

if(topName === "Σούπερ Μάρκετ")
    centerColor = "#3cff90";

if(topName === "Λογαριασμοί")
    centerColor = "#f5c542";

if(topName === "Προσωπικά")
    centerColor = "#b14dff";
        ctx.font =
            "28px sans-serif";

        ctx.fillStyle =
    centerColor;

        ctx.fillText(
            icon,
            x,
            y - 22
        );

        ctx.font =
            "bold 14px sans-serif";

        ctx.fillText(
            topName,
            x,
            y + 2
        );

        ctx.font =
            "bold 16px sans-serif";

        ctx.fillStyle =
    centerColor;

        ctx.fillText(
            topPercent + "%",
            x,
            y + 25
        );

        ctx.restore();

    }

},
ChartDataLabels
],


        type:"doughnut",

        data:{

            labels:
                Object.keys(totals),

            datasets:[{

                data:
                    Object.values(totals),
backgroundColor:
Object.keys(totals).map(category => {

    if(category === "Τσιγάρα")
        return "#ff4d4d";

    if(category === "Βενζίνη")
        return "#ff7a00";

    if(category === "Λογαριασμοί")
        return "#f5c542";

    if(category === "Σούπερ Μάρκετ")
        return "#3cff90";

    if(category === "Προσωπικά")
        return "#b14dff";

    return "#3ca6ff";

}),

    borderColor:"#111",

    borderWidth:3

}]

        },

        options:{

    responsive:true,

    cutout:"65%",

    plugins:{

    datalabels:{

        color:"#fff",

        font:{
            weight:"bold",
            size:14
        },

        formatter:(value,ctx)=>{

            const data =
            ctx.chart.data.datasets[0].data;

            const total =
            data.reduce((a,b)=>a+b,0);

            const percent =
Math.round(
    (value/total)*100
);

const maxValue =
Math.max(...data);

if(value === maxValue){
    return "";
}

return percent + "%";

        }

    },

    legend:{
        display:false
    }

}

}

});

}
function editExpense(index){

    const expense =
        expenses[index];

    editingIndex = index;

    document.getElementById(
        "modalCategory"
    ).value = expense.category;

    document.getElementById(
        "modalAmount"
    ).value = expense.amount;

    document.getElementById(
        "modalDate"
    ).value = expense.date;

    document.getElementById(
        "modalNote"
    ).value = expense.note || "";

    modal.style.display = "flex";
}
function renderStats(){

    const totals = {};
    

const filteredExpenses =
    expenses.filter(item =>
        item.date.startsWith(
            selectedMonth
        )
    );

filteredExpenses.forEach(item => {

    if(!totals[item.category]){

        totals[item.category] = 0;

    }

    totals[item.category] += item.amount;

});

const totalAmount =
Object.values(totals)
.reduce((a,b)=>a+b,0);

    let html = "";

    Object.entries(totals)
    .sort((a,b)=> b[1]-a[1])
    .forEach(([category,total])=>{

        html += `
        <div class="expense">
            <strong>${getCategoryIcon(category)}
            ${category}</strong>

            <div class="expense-amount">
                ${total.toFixed(2)}€
            </div>
        </div>
        `;
    });
let topHtml = "";

Object.entries(totals)
.sort((a,b)=> b[1]-a[1])
.slice(0,3)
.forEach(([category,total],index)=>{

    const medals = [
        "🥇",
        "🥈",
        "🥉"
    ];

    topHtml += `
    <div class="expense">

        <strong>
            ${medals[index]}
            ${getCategoryIcon(category)}
            ${category}
        </strong>

        <div class="expense-amount">
            ${total.toFixed(2)}€
        </div>

    </div>
    `;
});

let cardsHtml = "";

Object.entries(totals)
.forEach(([category,total])=>{

    const percent =
    ((total/totalAmount)*100)
    .toFixed(0);
let colorClass = "blue";

if(category === "Τσιγάρα")
    colorClass = "red";

if(category === "Βενζίνη")
    colorClass = "orange";

if(category === "Σούπερ Μάρκετ")
    colorClass = "green";

if(category === "Λογαριασμοί")
    colorClass = "gold";

if(category === "Προσωπικά")
    colorClass = "purple";

if(category === "Άλλα")
    colorClass = "blue";
    cardsHtml += `

    <div class="stat-card ${colorClass}">

        <div class="stat-icon">
            ${getCategoryIcon(category)}
        </div>

        <div class="stat-name">
            ${category}
        </div>

        <div class="stat-value">
            ${total.toFixed(2)}€
        </div>

        <div class="stat-percent">
            ${percent}%
        </div>

    </div>

    `;
});

document.getElementById(
    "statsCards"
).innerHTML = cardsHtml;
document.getElementById(
    "topExpenses"
).innerHTML = topHtml;
renderChart(totals);
}
function setTheme(color){

    document.documentElement
    .style.setProperty(
        '--primary',
        color
    );
document.body.classList.remove(
    "theme-pulse"
);

void document.body.offsetWidth;

document.body.classList.add(
    "theme-pulse"
);
    let rgb = "60,255,144";
    if(color === "#ff4d4d"){
    rgb = "255,77,77";
}

if(color === "#ff66cc"){
    rgb = "255,102,204";
}

if(color === "#ff7a00"){
    rgb = "255,122,0";
}

    if(color === "#3ca6ff"){
        rgb = "60,166,255";
    }

    if(color === "#b14dff"){
        rgb = "177,77,255";
    }
if(color === "#f5c542"){
    rgb = "245,197,66";
}
    if(color === "#aaaaaa"){
        rgb = "170,170,170";
    }

    document.documentElement
    .style.setProperty(
        '--glow1',
        `rgba(${rgb},.25)`
    );

    document.documentElement
    .style.setProperty(
        '--glow2',
        `rgba(${rgb},.15)`
    );

    document.documentElement
    .style.setProperty(
        '--glow3',
        `rgba(${rgb},.08)`
    );
document
.querySelectorAll(".theme-dot")
.forEach(btn=>{

    btn.classList.remove("active");

    if(btn.dataset.color === color){

        btn.classList.add("active");

    }

});
    localStorage.setItem(
        "themeColor",
        color
    );
}


const savedTheme =
localStorage.getItem("themeColor");

if(savedTheme){

    setTheme(savedTheme);

}
document
.getElementById("exportBtn")
.addEventListener("click",()=>{

    const data =
        JSON.stringify(expenses,null,2);

    const blob =
        new Blob(
            [data],
            {type:"application/json"}
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "expenses_backup.json";

    a.click();

    URL.revokeObjectURL(url);

});
document
.getElementById("clearDataBtn")
.addEventListener("click",()=>{

    if(
        confirm(
            "Να διαγραφούν όλα τα δεδομένα;"
        )
    ){

        expenses = [];

        saveData();

        render();

    }

});
document
.getElementById("importBtn")
.addEventListener("click",()=>{

    document
    .getElementById("importFile")
    .click();

});

document
.getElementById("importFile")
.addEventListener("change",(event)=>{

    const file =
        event.target.files[0];

    if(!file) return;

    const reader =
        new FileReader();

    reader.onload = function(e){

        try{

            const importedData =
                JSON.parse(e.target.result);

            if(
                !Array.isArray(importedData)
            ){
                throw new Error();
            }

            expenses = importedData;

            saveData();

            render();

            alert(
                "Το backup φορτώθηκε!"
            );

        }
        catch{

            alert(
                "Μη έγκυρο αρχείο backup."
            );

        }

    };

    reader.readAsText(file);

});
if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./service-worker.js")
            .then(() => {

                console.log(
                    "Service Worker ενεργός"
                );

            })
            .catch(error => {

                console.log(
                    "SW Error:",
                    error
                );

            });

    });

}
const monthPopup =
    document.getElementById("monthPopup");

document
.querySelector(".month-arrow")
.addEventListener("click",(e)=>{

    e.stopPropagation();

    monthPopup.classList.toggle("show");

});
document.addEventListener("click",(e)=>{

    if(
        !monthPopup.contains(e.target)
        &&
        !document
            .querySelector(".month-selector")
            .contains(e.target)
    ){

        monthPopup.classList.remove("show");

    }

});
document
.querySelectorAll(
    "#monthPopup button"
)
.forEach(btn=>{

    btn.addEventListener("click",()=>{

        const year =
            selectedMonth.split("-")[0];

        selectedMonth =
            year +
            "-" +
            btn.dataset.month;

        updateMonthLabel();

        render();

        monthPopup.classList.remove(
            "show"
        );

    });

});
document
.querySelectorAll(".cat-btn")
.forEach(btn=>{

    btn.addEventListener("click",()=>{

        document
        .querySelectorAll(".cat-btn")
        .forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        selectedCategory =
            btn.innerText
            .replace("🚬 ","")
            .replace("⛽ ","")
            .replace("🛒 ","")
            .replace("💡 ","")
            .replace("👕 ","")
            .replace("📦 ","");

        render();

    });

});