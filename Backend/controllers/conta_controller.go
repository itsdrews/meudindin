package controllers

import (
	"Backend/models"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Criar Conta
// POST /clientes/:id/contas
func CriarConta(c *gin.Context) {
	//  Obtém ID do cliente via URL
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

	// Faz o bind do corpo JSON da conta
	var novaConta models.Conta
	if err := c.ShouldBindJSON(&novaConta); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Dados inválidos"})
		return
	}
	// Cria a conta no banco (sem cliente ainda)
	if err := DB.Create(&novaConta).Error; err != nil {
		if strings.Contains(err.Error(), "duplicate key value") ||
			strings.Contains(err.Error(), "UNIQUE constraint failed") {
			c.JSON(http.StatusConflict, gin.H{
				"erro": "Já existe uma conta com o mesmo número, agência e banco.",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao criar conta", "detalhes": err.Error()})
		return
	}

	//  Associação automática após criação bem-sucedida
	if err := novaConta.AssociarCliente(DB, uint(clienteID)); err != nil {
		// Se falhar na associação, desfaz a criação (rollback manual)
		DB.Delete(&novaConta)
		c.JSON(http.StatusInternalServerError, gin.H{
			"erro":     "Erro ao associar cliente à conta, criação desfeita",
			"detalhes": err.Error(),
		})
		return
	}

	// Retorno de sucesso
	c.JSON(http.StatusCreated, gin.H{
		"mensagem": "Conta criada e associada com sucesso",
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
	// Captura parâmetros nomeados
	clienteIDParam := c.Param("cliente_id")
	contaIDParam := c.Param("conta_id")

	// Converte para uint
	clienteID64, err1 := strconv.ParseUint(clienteIDParam, 10, 64)
	contaID64, err2 := strconv.ParseUint(contaIDParam, 10, 64)
	if err1 != nil || err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "IDs inválidos"})
		return
	}

	clienteID := uint(clienteID64)
	contaID := uint(contaID64)

	// Verifica se o cliente existe
	var cliente models.Cliente
	if err := DB.First(&cliente, clienteID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Cliente não encontrado"})
		return
	}

	// Busca a conta associada ao cliente
	var conta models.Conta
	if err := DB.Where("id = ? AND cliente_id = ?", contaID, clienteID).First(&conta).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"erro": "Conta não encontrada para este cliente"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao buscar conta"})
		}
		return
	}

	// Faz o bind do JSON com os campos a atualizar
	var novosCampos map[string]interface{}
	if err := c.ShouldBindJSON(&novosCampos); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido"})
		return
	}

	// Usa o método encapsulado do struct
	if err := conta.AtualizarCamposEditaveis(DB, novosCampos); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	// Recarrega para garantir retorno atualizado
	if err := DB.First(&conta, contaID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao atualizar conta"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"mensagem": "Conta atualizada com sucesso",
		"conta":    conta,
	})
}

// Deletar Conta
// DELETE /contas/:id

