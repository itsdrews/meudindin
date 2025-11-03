package controllers

// TODO: RESOLVER A DUPLICAÇÂO DE CONTAS
import (
	"Backend/models"
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Criar Conta
// POST /contas
func CriarConta(c *gin.Context) {
	// Obtém ID do cliente via URL
	clienteIDParam := c.Param("id")
	clienteID, err := strconv.ParseUint(clienteIDParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "ID de cliente inválido"})
		return
	}

	// Verifica se o cliente existe
	var cliente models.Cliente
	if err := DB.First(&cliente, clienteID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Cliente não encontrado"})
		return
	}

	// Faz o bind do corpo JSON
	var novaConta models.Conta
	if err := c.ShouldBindJSON(&novaConta); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Dados inválidos"})
		return
	}

	// Define o ClienteID da conta
	novaConta.ClienteID = uint(clienteID)

	// Verifica duplicidade: mesmo número + agência + banco
	var contaExistente models.Conta
	if err := DB.Where(
		"cliente_id = ? AND TRIM(numero) = TRIM(?) AND CAST(agencia AS TEXT) = CAST(? AS TEXT) AND TRIM(banco) = TRIM(?)",
		novaConta.ClienteID, novaConta.Numero, novaConta.Agencia, novaConta.Banco,
	).First(&contaExistente).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"erro": "Conta já cadastrada com o mesmo número, agência e banco"})
		return
	}

	// Cria a conta
	if err := DB.Create(&novaConta).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao criar conta"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"mensagem": "Conta criada com sucesso",
		"conta":    novaConta,
	})
}

// Listar Contas
// GET /contas

func ListarContas(c *gin.Context) {
	var contas []models.Conta
	if err := DB.Find(&contas).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao buscar contas"})
		return
	}
	c.JSON(http.StatusOK, contas)
}

// TODO: AJUSTAR A CRIAÇÂO DUPLICADA DE CONTAS
// Buscar Conta por ID
// GET /contas/:id

func BuscarConta(c *gin.Context) {
	idParam := c.Param("id")
	idUint, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "ID inválido"})
		return
	}
	id := uint(idUint)

	var conta models.Conta
	if err := DB.First(&conta, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"erro": "Conta não encontrada"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao buscar conta"})
		}
		return
	}

	c.JSON(http.StatusOK, conta)
}

// Atualizar Conta
// PATCH /contas/:id

func AtualizarConta(c *gin.Context) {
	idParam := c.Param("id")
	idUint, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "ID inválido"})
		return
	}
	id := uint(idUint)

	var conta models.Conta
	if err := DB.First(&conta, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"erro": "Conta não encontrada"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao buscar conta"})
		}
		return
	}

	// Recebe os campos editáveis em JSON
	var novosCampos map[string]interface{}
	if err := c.ShouldBindJSON(&novosCampos); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido"})
		return
	}

	if err := conta.AtualizarCamposEditaveis(DB, novosCampos); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	c.JSON(http.StatusOK, conta)
}

// Deletar Conta
// DELETE /contas/:id

func DeletarConta(c *gin.Context) {
	idParam := c.Param("id")
	idUint, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "ID inválido"})
		return
	}
	id := uint(idUint)

	var conta models.Conta
	if err := DB.First(&conta, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"erro": "Conta não encontrada"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao buscar conta"})
		}
		return
	}

	if err := DB.Delete(&conta).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao deletar conta"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Conta deletada com sucesso"})
}

// Associar Conta a Cliente
// POST /contas/:id/associar/:cliente_id
func AssociarContaCliente(c *gin.Context) {
	idParam := c.Param("id")
	clienteParam := c.Param("cliente_id")

	idUint, err := strconv.ParseUint(idParam, 10, 64)
	clienteIDUint, err2 := strconv.ParseUint(clienteParam, 10, 64)
	if err != nil || err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "IDs inválidos"})
		return
	}
	id := uint(idUint)
	clienteID := uint(clienteIDUint)

	var conta models.Conta
	if err := DB.First(&conta, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Conta não encontrada"})
		return
	}

	if err := conta.AssociarCliente(DB, clienteID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao associar cliente"})
		return
	}

	c.JSON(http.StatusOK, conta)
}

// Desassociar Conta de Cliente
// POST /contas/:id/desassociar

func DesassociarContaCliente(c *gin.Context) {
	idParam := c.Param("id")
	idUint, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "ID inválido"})
		return
	}
	id := uint(idUint)

	var conta models.Conta
	if err := DB.First(&conta, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Conta não encontrada"})
		return
	}

	if err := conta.DesassociarCliente(DB); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao desassociar cliente"})
		return
	}

	c.JSON(http.StatusOK, conta)
}
