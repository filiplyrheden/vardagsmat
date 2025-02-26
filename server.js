const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const filePath = './recipes.json';

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Hämta alla recept
app.get('/recipes', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Server error');
        res.json(JSON.parse(data));
    });
});

// Lägg till ett nytt recept
app.post('/recipes', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Server error');
        let recipes = JSON.parse(data);
        const newRecipe = { id: recipes.length + 1, ...req.body };
        recipes.push(newRecipe);
        fs.writeFile(filePath, JSON.stringify(recipes, null, 2), (err) => {
            if (err) return res.status(500).send('Could not save');
            res.json(newRecipe);
        });
    });
});

// Redigera recept
app.put('/recipes/:id', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Server error');
        let recipes = JSON.parse(data);
        const recipeIndex = recipes.findIndex(r => r.id == req.params.id);
        if (recipeIndex === -1) return res.status(404).send('Recipe not found');

        recipes[recipeIndex] = { id: Number(req.params.id), ...req.body };
        fs.writeFile(filePath, JSON.stringify(recipes, null, 2), (err) => {
            if (err) return res.status(500).send('Could not update');
            res.json(recipes[recipeIndex]);
        });
    });
});

// Ta bort recept
app.delete('/recipes/:id', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Server error');
        let recipes = JSON.parse(data);
        recipes = recipes.filter(r => r.id != req.params.id);
        fs.writeFile(filePath, JSON.stringify(recipes, null, 2), (err) => {
            if (err) return res.status(500).send('Could not delete');
            res.sendStatus(204);
        });
    });
});

const menuIndexPath = './menuIndex.json';

// Generera veckomeny med rotation
app.get('/weekly-menu', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Server error');

        let recipes = JSON.parse(data);
        if (recipes.length < 5) return res.status(400).send('Not enough recipes');

        // Läs index från menuIndex.json
        fs.readFile(menuIndexPath, 'utf8', (err, indexData) => {
            let startIndex = indexData.trim() ? JSON.parse(indexData).index : 0;

            // Välj fem recept från startIndex och loopa runt om nödvändigt
            let menu = [];
            for (let i = 0; i < 5; i++) {
                menu.push(recipes[(startIndex + i) % recipes.length]);
            }

            // Uppdatera index och spara tillbaka
            let newIndex = (startIndex + 5) % recipes.length;
            fs.writeFile(menuIndexPath, JSON.stringify({ index: newIndex }), (err) => {
                if (err) console.error('Could not update menu index');
            });

            res.json(menu);
        });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));