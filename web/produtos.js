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
            </div>

            <div class="produto-info">
              <div class="produto-info-item">
                <span class="produto-info-label">Email:</span>
                <span>${produto.email}</span>
              </div>
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
