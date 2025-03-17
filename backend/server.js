const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3000;

// Enable CORS
app.use(express.json());
app.use(cors());

const sequelize = new Sequelize('mydb', 'admin', 'Timndbpw10!', {
    host: 'database-1.cnqe00p5d1ax.us-east-1.rds.amazonaws.com',
    dialect: 'mysql',
    logging: false, 
});

sequelize.authenticate()
  .then(() => console.log('Connected to MySQL database.'))
  .catch(err => console.error('Database connection failed:', err));


// Define Puppy Model
const Puppy = sequelize.define('Puppy', {
    pet_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    breed: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    age_est: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    current_kennel_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'puppies',
    timestamps: false,
  });
  
  // Sync Model with Database
  sequelize.sync()
    .then(() => console.log('Puppy table is ready!'))
    .catch(err => console.error('Error syncing table:', err));
  
  // Routes
  
  // GET all puppies
  app.get('/', async (req, res) => {
    try {
      const puppies = await Puppy.findAll();
      res.json(puppies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // GET puppy by ID
  app.get('/:id', async (req, res) => {
    try {
      const puppy = await Puppy.findByPk(req.params.id);
      if (!puppy) return res.status(404).json({ message: 'Puppy not found' });
      res.json(puppy);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // POST - Add a new puppy
  app.post('/', async (req, res) => {
    try {
      const { name, breed, age_est, current_kennel_number } = req.body;
      const newPuppy = await Puppy.create({ name, breed, age_est, current_kennel_number });
      res.status(201).json(newPuppy);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // PUT - Update puppy by ID
  app.put('/:id', async (req, res) => {
    try {
      const puppy = await Puppy.findByPk(req.params.id);
      if (!puppy) return res.status(404).json({ message: 'Puppy not found' });
      await puppy.update(req.body);
      res.json(puppy);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // DELETE - Remove a puppy by ID
  app.delete('/:id', async (req, res) => {
    try {
      const puppy = await Puppy.findByPk(req.params.id);
      if (!puppy) return res.status(404).json({ message: 'Puppy not found' });
      await puppy.destroy();
      res.json({ message: 'Puppy deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});