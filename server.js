const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'dist', 'taskmanager-frontend')));

app.get('/*', function(req, res) {   
    res.sendFile(path.join(__dirname, 'dist', 'taskmanager-frontend', 'index.html'));
});

app.listen(process.env.PORT || 3000);