package controllers

import (
	"Backend/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Criar transação
func CriarTransacao(c *gin.Context) {
	clienteID := c.GetUint("cliente_id")

	// Param conta
	contaID, _ := strconv.ParseUint(c.Param("id"), 10, 64)

	// Verifica se a conta pertence ao cliente
	var conta models.Conta
	if err := DB.Where("id = ? AND cliente_id = ?", contaID, clienteID).First(&conta).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "conta não encontrada ou não pertence ao cliente"})
		return
	}

	var transacao models.Transacao
	if err := c.ShouldBindJSON(&transacao); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido"})
		return
	}

	transacao.ContaID = uint(contaID)

	if err := DB.Create(&transacao).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao criar transação"})
		return
	}

	c.JSON(http.StatusCreated, transacao)
}

// Listar transações da conta
func ListarTransacoesPorConta(c *gin.Context) {
	clienteID := c.GetUint("cliente_id")
	contaID, _ := strconv.ParseUint(c.Param("id"), 10, 64)

	var conta models.Conta
	if err := DB.Where("id = ? AND cliente_id = ?", contaID, clienteID).First(&conta).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "conta não encontrada"})
		return
	}

	var transacoes []models.Transacao
	DB.Where("conta_id = ?", conta.ID).Find(&transacoes)

	c.JSON(http.StatusOK, transacoes)
}

// Buscar transação por ID
func ObterTransacaoPorID(c *gin.Context) {
	clienteID := c.GetUint("cliente_id")

	contaID, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	transacaoID, _ := strconv.ParseUint(c.Param("transacaoId"), 10, 64)

	// valida conta
	var conta models.Conta
	if err := DB.Where("id = ? AND cliente_id = ?", contaID, clienteID).First(&conta).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "conta não encontrada"})
		return
	}

	// valida transação
	var t models.Transacao
	if err := DB.Where("id = ? AND conta_id = ?", transacaoID, contaID).First(&t).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "transação não encontrada"})
		return
	}

	c.JSON(http.StatusOK, t)
}

// Atualizar identificador
func AtualizarIdentificadorTransacao(c *gin.Context) {
	clienteID := c.GetUint("cliente_id")

	contaID, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	transacaoID, _ := strconv.ParseUint(c.Param("transacaoId"), 10, 64)

	// valida conta
	var conta models.Conta
	if err := DB.Where("id = ? AND cliente_id = ?", contaID, clienteID).First(&conta).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "conta inválida"})
		return
	}

	// valida transação
	var t models.Transacao
	if err := DB.Where("id = ? AND conta_id = ?", transacaoID, contaID).First(&t).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "transação não encontrada"})
		return
	}

	var req struct {
		Identificador string `json:"identificador"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido"})
		return
	}

	if err := t.AtualizarIdentificador(DB, req.Identificador); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mensagem": "Identificador atualizado", "transacao": t})
}
