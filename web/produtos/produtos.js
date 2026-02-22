const produtosGrid = document.getElementById('produtosGrid')
const emptyState = document.getElementById('emptyState')

async function carregarProdutos() {
  try {
    const response = await fetch('http://localhost:3000/produtos')
    const data = await response.json()

    if (data.success && data.data.length > 0) {
      emptyState.style.display = 'none'
      produtosGrid.innerHTML = ''

      data.data.forEach(produto => {
        const card = document.createElement('div')
        card.className = 'produto-card'

        const preco = parseFloat(produto.price).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        card.innerHTML = `
          <div class="produto-content">
            <div class="produto-header">
              <h3 class="produto-nome">${produto.name}</h3>
              <span class="produto-categoria">${produto.category}</span>
              <button class="delete-btn" title="Apagar produto">🗑️</button>
            </div>

            <div class="produto-info">
              <div class="produto-info-item">
                <span class="produto-info-label">Categoria:</span>
                <span>${produto.category}</span>
              </div>
            </div>

            <div class="produto-preco">${preco}</div>

            <p class="produto-descricao">${produto.description || 'Sem descrição disponível'}</p>
          </div>
        `

        produtosGrid.appendChild(card)

        const deleteBtn = card.querySelector('.delete-btn')
        if (deleteBtn) {
          deleteBtn.addEventListener('click', async () => {
            if (!confirm('Deseja realmente apagar este produto?')) return
            try {
              const resp = await fetch(`http://localhost:3000/produtos/${produto.id}`, {
                method: 'DELETE'
              })
              const result = await resp.json()
              if (resp.ok) {
                alert(result.message || 'Produto deletado com sucesso')
                carregarProdutos()
              } else {
                alert(result.message || 'Erro ao deletar produto')
              }
            } catch (err) {
              console.error('Erro ao apagar produto:', err)
              alert('Erro ao deletar produto')
            }
          })
        }
      })
    } else {
      produtosGrid.innerHTML = ''
      emptyState.style.display = 'block'
    }
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    produtosGrid.innerHTML = '<div class="loading">Erro ao carregar produtos. Tente novamente.</div>'
  }
}

carregarProdutos()

setInterval(carregarProdutos, 5000)
