import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

const pool = mysql.createPool({
  host: 'benserverplex.ddns.net',
  user: 'alunos',
  password: 'senhaAlunos',
  database: 'web_03mb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

app.post('/produtos', async (req, res) => {
  try {
    const { name, price, description, category } = req.body

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Nome, preço e categoria são obrigatórios'
      })
    }

    const connection = await pool.getConnection()

    const query = 'INSERT INTO produtos_geovana (name, price, category, description) VALUES (?, ?, ?, ?)'

    const [result] = await connection.execute(query, [name, price, category, description])

    connection.release()

    res.status(201).json({
      success: true,
      message: 'Produto salvo com sucesso',
      id: result.insertId
    })
  } catch (error) {
    console.error('Erro ao salvar produto:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao salvar produto',
      error: error.message
    })
  }
})

app.get('/produtos', async (req, res) => {
  try {
    const connection = await pool.getConnection()

    const query = 'SELECT name, price, category, description FROM produtos_geovana'

    const [products] = await connection.execute(query)

    connection.release()

    res.status(200).json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produtos',
      error: error.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor funcionando em http://localhost:${PORT}`)
})
