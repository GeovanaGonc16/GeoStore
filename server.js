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

    const query = 'SELECT id, name, price, category, description FROM produtos_geovana'

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

// rota para deletar produto por id
app.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'ID do produto é obrigatório'
    })
  }

  try {
    const connection = await pool.getConnection()

    const query = 'DELETE FROM produtos_geovana WHERE id = ?'
    const [result] = await connection.execute(query, [id])

    connection.release()

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Produto deletado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao deletar produto:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar produto',
      error: error.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor funcionando em http://localhost:${PORT}`)
})
