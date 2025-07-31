const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL bağlantısı (Neon.tech)
const pool = new Pool({
  user: 'neondb_owner',
  host: 'ep-round-boat-adpsdwhx-pooler.c-2.us-east-1.aws.neon.tech',
  database: 'neondb',
  password: 'npg_lC3SfQ5RvemM',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

// Veritabanı bağlantısını test et
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL bağlantı hatası:', err);
  } else {
    console.log('PostgreSQL bağlantısı başarılı!');
  }
});

// Kullanıcılar tablosunu oluştur
const createTables = async () => {
  try {
    // Users tablosu - Firebase Auth verilerini destekleyecek şekilde güncellendi
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        firebase_uid VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        surname VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // User profiles tablosu - Firebase'deki tüm profil verilerini destekleyecek
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        gender VARCHAR(50),
        birth_date VARCHAR(50),
        birth_time VARCHAR(50),
        birth_place VARCHAR(255),
        zodiac VARCHAR(50),
        job VARCHAR(255),
        relationship VARCHAR(100),
        notification_settings JSONB DEFAULT '{}',
        sound_settings JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Veritabanı tabloları oluşturuldu!');
  } catch (error) {
    console.error('Tablo oluşturma hatası:', error);
  }
};

createTables();

// Üye ol API'si
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, surname } = req.body;

    // Email kontrolü
    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Bu email adresi zaten kullanılıyor!' });
    }

    // Şifreyi hashle
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Kullanıcıyı kaydet
    const result = await pool.query(
      'INSERT INTO users (email, password, name, surname) VALUES ($1, $2, $3, $4) RETURNING id, email, name, surname',
      [email, hashedPassword, name, surname]
    );

    const user = result.rows[0];

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname
      },
      token
    });

  } catch (error) {
    console.error('Üye olma hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası!' });
  }
});

// Giriş yap API'si
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı bul
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email veya şifre hatalı!' });
    }

    const user = result.rows[0];

    // Şifreyi kontrol et
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email veya şifre hatalı!' });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Giriş başarılı!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname
      },
      token
    });

  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası!' });
  }
});

// Profil güncelleme API'si
app.put('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { gender, birthDate, birthTime, birthPlace, zodiac, job, relationshipStatus } = req.body;

    // Profil var mı kontrol et
    const profileCheck = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
    
    if (profileCheck.rows.length > 0) {
      // Profili güncelle
      await pool.query(`
        UPDATE user_profiles 
        SET gender = $1, birth_date = $2, birth_time = $3, birth_place = $4, zodiac = $5, job = $6, relationship = $7
        WHERE user_id = $8
      `, [gender, birthDate, birthTime, birthPlace, zodiac, job, relationshipStatus, userId]);
    } else {
      // Yeni profil oluştur
      await pool.query(`
        INSERT INTO user_profiles (user_id, gender, birth_date, birth_time, birth_place, zodiac, job, relationship)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [userId, gender, birthDate, birthTime, birthPlace, zodiac, job, relationshipStatus]);
    }

    res.json({ message: 'Profil başarıyla güncellendi!' });

  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası!' });
  }
});

// Profil getirme API'si
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(`
      SELECT u.id, u.email, u.name, u.surname, up.*
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı!' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası!' });
  }
});

// Test endpoint'i
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API çalışıyor!' });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor!`);
  console.log(`http://localhost:${PORT}`);
}); 