package controllers

import (
	"Backend/models"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Criar meta associada a uma conta (cliente autenticado)
func CriarMeta(c *gin.Context) {
	//  Obtém ID do cliente autenticado via token
	clienteIDValue, existe := c.Get("cliente_id")
	if !existe {
		c.JSON(http.StatusUnauthorized, gin.H{"erro": "Token inválido ou ausente"})
		return
	}
	clienteID := clienteIDValue.(uint)

	// ID da conta via rota
	contaIDParam := c.Param("id")
	contaID64, err := strconv.ParseUint(contaIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "ID da conta inválido"})
		return
	}
	contaID := uint(contaID64)

	// ======== BIND ESPECÍFICO DO JSON ========
	var body struct {
		Nome       string  `json:"nome"`
		Descricao  string  `json:"descricao"`
		DataLimite string  `json:"data_limite"`
		Valor      float32 `json:"valor"`
		ValorAlvo  float32 `json:"valor_alvo"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido", "detalhes": err.Error()})
		return
	}

	// ======== PARSE DA DATA ========
	dataLimite, err := time.Parse("2006-01-02", body.DataLimite)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Data inválida. Use YYYY-MM-DD"})
		return
	}

	// ======== CRIA OBJETO META ========
	meta := models.Meta{
		Nome:       body.Nome,
		Descricao:  body.Descricao,
		DataInicio: time.Now(),
		DataLimite: dataLimite,
		Valor:      body.Valor,
		ValorAlvo:  body.ValorAlvo,
		ClienteID:  clienteID,
		ContaID:    contaID,
	}

	// ======== CRIAR META NO BANCO ========
	if err := DB.Create(&meta).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao criar meta"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"mensagem": "Meta criada com sucesso",
		"meta":     meta,
	})
}

// Listar metas de um cliente autenticado (todas as contas)
func ListarMetasPorCliente(c *gin.Context) {
	// Recupera ID do cliente autenticado via JWT
	clienteIDValue, existe := c.Get("cliente_id")
	if !existe {
		c.JSON(http.StatusUnauthorized, gin.H{"erro": "Token inválido ou ausente"})
		return
	}
	clienteID := clienteIDValue.(uint)

	var metas []models.Meta

	// Busca todas as metas associadas a qualquer conta do cliente
	if err := DB.Preload("Conta").
		Where("cliente_id = ?", clienteID).
		Find(&metas).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao listar metas"})
		return
	}

	c.JSON(http.StatusOK, metas)
}

// GET na meta por meta_id
func ObterMetaPorID(c *gin.Context) {
	// Recupera ID do cliente autenticado
	clienteIDValue, existe := c.Get("cliente_id")
	if !existe {
		c.JSON(http.StatusUnauthorized, gin.H{"erro": "Token inválido ou ausente"})
		return
	}
	clienteID := clienteIDValue.(uint)

	// Converte ID do parâmetro
	metaIDParam := c.Param("id")
	metaID64, err := strconv.ParseUint(metaIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "ID de meta inválido"})
		return
	}
	metaID := uint(metaID64)

	var meta models.Meta

	// Busca garantindo que a meta pertence ao cliente autenticado
	err = DB.Preload("Conta").
		Where("id = ? AND cliente_id = ?", metaID, clienteID).
		First(&meta).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"erro": "Meta não encontrada"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao buscar meta"})
		return
	}

	c.JSON(http.StatusOK, meta)
}

// Atualizar nome da meta chama metodo encapsulado em Entidade Meta
func AtualizarNomeMeta(c *gin.Context) {
	id := c.Param("id")

	// Bind do JSON
	var req struct {
		Nome string `json:"nome"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido"})
		return
	}

	// Busca a meta
	var meta models.Meta
	if err := DB.First(&meta, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Meta não encontrada"})
		return
	}

	// Chama método encapsulado na entidade
	if err := meta.AtualizarNome(DB, req.Nome); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"mensagem": "Nome atualizado com sucesso",
		"meta":     meta,
	})
}

// Atualizar valor alvo
func AtualizarValorAlvoMeta(c *gin.Context) {
	id := c.Param("id")

	// Bind do JSON
	var req struct {
		ValorAlvo float32 `json:"valor_alvo"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido"})
		return
	}

	// Busca meta
	var meta models.Meta
	if err := DB.First(&meta, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Meta não encontrada"})
		return
	}

	// Chama regra de negócio encapsulada
	if err := meta.AtualizarValorAlvo(DB, req.ValorAlvo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"mensagem": "Valor alvo atualizado com sucesso",
		"meta":     meta,
	})
}

// Atualizar data limite
func AtualizarDataLimiteMeta(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		DataLimite string `json:"data_limite"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido"})
		return
	}

	data, err := time.Parse("2006-01-02", req.DataLimite)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Data inválida (use formato YYYY-MM-DD)"})
		return
	}

	var meta models.Meta
	if err := DB.First(&meta, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Meta não encontrada"})
		return
	}

	if err := meta.AtualizarDataLimite(DB, data); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao atualizar data limite"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mensagem": "Data limite atualizada com sucesso", "meta": meta})
}

// Atualizar progresso
func AtualizarProgressoMeta(c *gin.Context) {
	id := c.Param("id")

	var req struct {
		Valor float32 `json:"valor"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido"})
		return
	}

	// Obtém meta
	var meta models.Meta
	if err := DB.First(&meta, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Meta não encontrada"})
		return
	}

	// Chama método encapsulado
	if err := meta.AtualizarProgresso(DB, req.Valor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"mensagem": "Progresso atualizado com sucesso",
		"meta":     meta,
	})
}

// Marcar meta como concluída
func MarcarMetaConcluida(c *gin.Context) {
	id := c.Param("id")

	var meta models.Meta
	if err := DB.First(&meta, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Meta não encontrada"})
		return
	}

	if err := meta.MarcarConcluida(DB); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"mensagem": "Meta concluída com sucesso",
		"meta":     meta,
	})
}

// Deletar meta (desassocia antes)
func DeletarMeta(c *gin.Context) {
	id := c.Param("id")

	var meta models.Meta
	if err := DB.First(&meta, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"erro": "Meta não encontrada"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao buscar meta"})
		return
	}

	if meta.ContaID != 0 {
		if err := meta.DesassociarConta(DB); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao desassociar conta antes da exclusão"})
			return
		}
	}

	if err := DB.Delete(&meta).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao deletar meta"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mensagem": "Meta deletada com sucesso"})
}
