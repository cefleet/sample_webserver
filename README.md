# Sample Webserver
This can be a simple setup to get started making a webserver and rest api.
You can technically just to do the "setup node" section and clone the repo to test it out.
If you want to do that you can simply do this:
1. Do the Setup Node section.
2. Clone this repo.
3. from a terminal run the command 
```
npm install
```
4. Update the database credentials in the index.js file:
```
const pool = mysql.createPool({ 
  //Your credentials here
})
```
5. From terminal 
```
node index.js
```

6. Goto browser and enter the url
```
http://localhost:300
```

# Tutorial for Setting up system for local development on windows
Follow this to understand each section.
## Setup node
1. Download node:
> https://nodejs.org/dist/v22.18.0/node-v22.18.0-x64.msi
2. Click yes or next until it ask to install native tools.
- - There is a checkbox that says something about installing chocolaty, make sure that is clicked.
3. Click next and install
4. It may ask several "do you want to allow ..." click yes for all of those.
5. After node is installed it will pull up a terminal and ask you if you want to install chocolaty and other things to the terminal. Say yes and continue. (this took quite a while)

## Install Express and make the first routes
> (you can do this in vs code or powershell)

> https://code.visualstudio.com/

I had to restart vs code to have not show up, not sure why.

1. Open a new project or create a folder 
2. Click on terminal new terminal
3. type npm init (just click enter at each question)
- - if you get an error that says c:\ {stuff} \ cannot be loaded because ...

You will need to do this:
Run Powershell as administrator 
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted

then repeat 3.
4. npm install express

5. make a new file in the folder called index.js
6. copy this code:
```
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
```
7. in the terminal in vscode type:
```
node index.js
```
8. Go to a browser and go to the url:
```
http://localhost:3000
```
If you see hello world you are good to move on.

## Connect to a mysql database
1. in the terminal install mysql library for js:
```
npm install mysql2
```
2. Create a database and add a table to your database. Make sure you know the database name and the table name.

3. Update the code in index.js with this:
```
const express = require('express')
const app = express()
const mysql = require('mysql2/promise');

const port = 3000

const pool = mysql.createPool({
  host: 'YOUR_DATABASE_URL', //url for the database instance (not the database name)
  user: 'YOUR_USERNAME',//or whatever user you are using 
  password: 'YOUR_PASWORD', //password
  database: 'DATABASE_NAME'
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

//items should reflect the name of the table
app.get('/items', async (req,res)=>{
  const connection = await pool.getConnection();
  try {
    //'items' is the name of the table you made 
    const [rows, fields] = await connection.execute('SELECT * FROM items;');
    res.json(rows);
  } finally {
    connection.release(); // Release the connection back to the pool
  }
});
```

4. in the terminal run program: 
```
node index.js
```

5. Go to a browser an enter in the url:
```
http://localhost:3000/items 
```
Where items is the name of the route you made earlier.

# Make a tiny web app to test writing to the database
> You can technically do this from construct or any other system like postman that can send a http type request with a POST/PUT method.
This is so you can test your routes without writing code in construct.
1. Add ability to host html file from 
2. Add post route to insert into the database:
```
//previous code
 ...

app.post('/add-item', async (req,res)=>{
  //We will accept the value from req.body eventually
  const connection = await pool.getConnection();

  //this just randomly makes a string for now.
  const value = Math.random().toString(36).substring(2, 10); 
  try {

    //Here my table is named 'items' and i only have 'name' as a column on this item 
    const [rows, fields] = await connection.execute('INSERT INTO items (name) VALUES (?);',[value]);
    res.json({results:'row added'});
  } finally {
    connection.release(); // Release the connection back to the pool
  }
});

//this is already here
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
```

3. Add ability to host html file from the webserver
```
const express = require('express')
const app = express()
const mysql = require('mysql2/promise');
//add path
const path = require('path');
...
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

/* 
comment this out
app.get('/', (req, res) => {
  res.send('Hello World!')
});
*/

```
4. Add index.html file and public folder:
>public/index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button id="add-item">Add Item</button>
    <ol id="items"></ol>

    <script>
        const addItemButton = document.getElementById('add-item');
        const itemsElement = document.getElementById('items');

        addItemButton.addEventListener('click',()=>{
            fetch('http://localhost:3000/add-item',{method:'post'}).then(res=>res.json().then(results=>{
                getItems()
            }));
        });

        function getItems(){
            fetch('http://localhost:3000/items').then(res=>res.json()).then(results=>{
                //
                itemsElement.innerHTML ='';
                results.map(item=>{
                    const anItem = document.createElement('li');
                    anItem.innerHTML = `id: ${item.id} | name: ${item.name}` 
                    itemsElement.appendChild(anItem)
                })
            })
        }

        getItems();
    </script>
</body>
</html>
