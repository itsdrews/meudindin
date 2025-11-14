package controllers

import (
	"Backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type criarTransacaoInput struct {
	Tipo      string    `json:"tipo"`      // "receita" ou "despesa"
	Valor     float64   `json:"valor"`
	Categoria string    `json:"categoria"`
	Descricao string    `json:"descricao"`
	Data      time.Time `json:"data"`
}

// POST /transacoes
func CriarTransacao(c *gin.Context) {
	var input criarTransacaoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Dados inválidos"})
		return
	}

	if input.Tipo != "receita" && input.Tipo != "despesa" {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "tipo deve ser 'receita' ou 'despesa'"})
		return
	}

	if input.Data.IsZero() {
		input.Data = time.Now()
	}

	transacao := models.Transacao{
		Tipo:      input.Tipo,
		Valor:     input.Valor,
		Descricao: input.Descricao,
		Origem:    input.Categoria, // usando Origem como categoria simplificada
		Data:      input.Data,
	}

	if err := DB.Create(&transacao).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao salvar transação"})
		return
	}

	c.JSON(http.StatusCreated, transacao)
}

// GET /transacoes
func ListarTransacoes(c *gin.Context) {
	var transacoes []models.Transacao
	if err := DB.Order("data desc").Find(&transacoes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao listar transações"})
		return
	}
	c.JSON(http.StatusOK, transacoes)
}
