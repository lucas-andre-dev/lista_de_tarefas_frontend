# 📋 Sistema de Lista de Tarefas

Sistema web completo para cadastro e gerenciamento de tarefas com funcionalidades de CRUD, reordenação e destaque visual para custos altos.

## 🚀 Demonstração

<img width="1791" height="880" alt="image" src="https://github.com/user-attachments/assets/1c5ac44d-1f70-4d6f-b733-5a9f79e870ab" />
<img width="1766" height="884" alt="image" src="https://github.com/user-attachments/assets/551e03a6-9318-41cb-b8c7-7966573a7b97" />

## 📌 Sobre o Projeto

Este projeto foi desenvolvido como parte do **processo seletivo para vaga de estágio em Desenvolvimento Web**. O desafio consistia em criar um sistema completo de gerenciamento de tarefas seguindo uma especificação técnica detalhada.

### Funcionalidades implementadas:
- ✅ Listagem de tarefas ordenadas
- ✅ Inclusão de novas tarefas
- ✅ Edição de tarefas existentes
- ✅ Exclusão com confirmação
- ✅ Reordenação manual (botões ▲ ▼)
- ✅ Destaque visual para tarefas com custo ≥ R$ 1.000,00
- ✅ Somatório total dos custos no rodapé
- ✅ Validação de nome duplicado
- ✅ Formatação brasileira (datas e valores)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**
- **CSS3** (com animações e design responsivo)
- **JavaScript Vanilla** (ES6+)
- **Fetch API** para comunicação com backend
- 
### Deploy
- **Frontend**:[Vercel](https://vercel.com/)
- **Backend**: [Vercel](https://vercel.com/)
- **Banco de Dados**: Prisma.io

## 📦 Estrutura do Projeto

```
sistema-lista-tarefas/
├── frontend/
│   ├── index.html          # Estrutura da página
│   ├── style.css           # Estilos e animações
│   └── tarefas.js          # Lógica da aplicação


## 🗄️ Banco de Dados

### Tabela: `tarefas`

| Campo         | Tipo          | Descrição                              |
|---------------|---------------|----------------------------------------|
| id            | INTEGER       | Identificador único (PRIMARY KEY)      |
| nome_tarefa   | VARCHAR(255)  | Nome da tarefa (UNIQUE)                |
| custo         | DECIMAL(10,2) | Custo da tarefa (≥ 0)                  |
| data_limite   | DATE          | Data limite para conclusão             |
| ordem         | INTEGER       | Ordem de apresentação                  |

### Script SQL (PostgreSQL)

```sql
CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    nome_tarefa VARCHAR(255) UNIQUE NOT NULL,
    custo DECIMAL(10, 2) NOT NULL CHECK (custo >= 0),
    data_limite DATE NOT NULL,
    ordem INTEGER NOT NULL
);
```
## 🎯 Funcionalidades Detalhadas

### 📝 Incluir Tarefa
- Clique no botão "ADICIONAR TAREFA"
- Preencha: Nome, Custo e Data Limite
- A tarefa é adicionada ao final da lista
- Validação de nome duplicado

### ✏️ Editar Tarefa
- Clique no ícone ✏️ ao lado da tarefa
- Modifique os campos desejados
- Apenas Nome, Custo e Data podem ser alterados
- Validação de nome duplicado

### 🗑️ Excluir Tarefa
- Clique no ícone 🗑️
- Confirme a exclusão
- Tarefa removida permanentemente

### 🔄 Reordenar Tarefas
- Use os botões ▲ (subir) e ▼ (descer)
- A primeira tarefa não pode subir
- A última tarefa não pode descer
- A ordem é salva automaticamente

### 💰 Destaque de Custo Alto
- Tarefas com custo ≥ R$ 1.000,00 aparecem com fundo amarelo
- Somatório total exibido no rodapé

## 🌐 API Endpoints

### GET `/tarefas`
Retorna todas as tarefas ordenadas

**Resposta:**
```json
[
  {
    "id": 1,
    "nome_tarefa": "Comprar material",
    "custo": 1500.00,
    "data_limite": "2026-03-15",
    "ordem": 1
  }
]
```

### POST `/tarefas`
Cria uma nova tarefa

**Body:**
```json
{
  "nome_tarefa": "Nova Tarefa",
  "custo": 250.00,
  "data_limite": "2026-04-20",
  "ordem": 5
}
```

### PUT `/tarefas/:id`
Atualiza uma tarefa existente

**Body:**
```json
{
  "nome_tarefa": "Tarefa Atualizada",
  "custo": 300.00,
  "data_limite": "2026-05-10",
  "ordem": 2
}
```

### DELETE `/tarefas/:id`
Exclui uma tarefa

**Resposta:**
```json
{
  "mensagem": "Tarefa excluída com sucesso"
}
```

## 📄 Licença

Este projeto foi desenvolvido para fins de avaliação técnica em processo seletivo.

## 👨‍💻 Desenvolvedor

**Lucas André* - Candidato à vaga de Estágio em Desenvolvimento Web
- GitHub:  https://github.com/lucas-andre-dev?tab=repositories
- LinkedIn: https://www.linkedin.com/in/lucas-andr%C3%A9-3351381a0/
- Email: lucasandrecardoso@hotmail.com

---

💼 **Projeto desenvolvido como parte do processo seletivo - Fevereiro/2026**
