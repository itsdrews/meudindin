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
	//  Obtém o ID do cliente autenticado via token
	clienteIDValue, existe := c.Get("cliente_id")
	if !existe {
		c.JSON(http.StatusUnauthorized, gin.H{"erro": "Token inválido ou ausente"})
		return
	}
	clienteID, ok := clienteIDValue.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Falha ao interpretar ID do cliente"})
		return
	}

	//  Obtém ID da conta da rota
	contaIDParam := c.Param("id")
	contaID64, err := strconv.ParseUint(contaIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "ID da conta inválido"})
		return
	}
	contaID := uint(contaID64)

	//  Faz o bind do corpo JSON
	var meta models.Meta
	if err := c.ShouldBindJSON(&meta); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido"})
		return
	}

	//  Define campos obrigatórios
	meta.ClienteID = clienteID
	meta.ContaID = contaID
	meta.DataInicio = time.Now()

	//  Cria a meta
	if err := DB.Create(&meta).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao criar meta"})
		return
	}
	//////// TO DO : REFATORAR CRIAÇÂO DE CONTA
	//  Associa conta à meta
	if err := meta.AssociarConta(DB, contaID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao associar conta à meta"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"mensagem": "Meta criada com sucesso",
		"meta":     meta,
	})
}

// Listar metas de uma conta específica (cliente autenticado)
func ListarMetasPorConta(c *gin.Context) {
	clienteIDValue, existe := c.Get("cliente_id")
	if !existe {
		c.JSON(http.StatusUnauthorized, gin.H{"erro": "Token inválido ou ausente"})
		return
	}
	clienteID := clienteIDValue.(uint)

	contaID := c.Param("conta_id")
	var metas []models.Meta

	if err := DB.Preload("Conta").
		Where("conta_id = ? AND cliente_id = ?", contaID, clienteID).
		Find(&metas).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao listar metas"})
		return
	}

	c.JSON(http.StatusOK, metas)
}

// Buscar meta por ID (cliente autenticado)
func ObterMetaPorID(c *gin.Context) {
	clienteIDValue, existe := c.Get("cliente_id")
	if !existe {
		c.JSON(http.StatusUnauthorized, gin.H{"erro": "Token inválido ou ausente"})
		return
	}
	clienteID := clienteIDValue.(uint)

	id := c.Param("id")
	var meta models.Meta

	if err := DB.Preload("Conta").
		Where("id = ? AND cliente_id = ?", id, clienteID).
		First(&meta).Error; err != nil {

		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"erro": "Meta não encontrada"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao buscar meta"})
		return
	}

	c.JSON(http.StatusOK, meta)
}

// Atualizar nome da meta
func AtualizarNomeMeta(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Nome string `json:"nome"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido"})
		return
	}

	var meta models.Meta
	if err := DB.First(&meta, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Meta não encontrada"})
		return
	}

	if err := meta.AtualizarNome(DB, req.Nome); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao atualizar nome"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mensagem": "Nome atualizado com sucesso", "meta": meta})
}

// Atualizar valor alvo
func AtualizarValorAlvoMeta(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		ValorAlvo float32 `json:"valor_alvo"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido"})
		return
	}

	var meta models.Meta
	if err := DB.First(&meta, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Meta não encontrada"})
		return
	}

	if err := meta.AtualizarValorAlvo(DB, req.ValorAlvo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao atualizar valor alvo"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mensagem": "Valor alvo atualizado com sucesso", "meta": meta})
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

	var meta models.Meta
	if err := DB.First(&meta, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Meta não encontrada"})
		return
	}

	if err := meta.AtualizarProgresso(DB, req.Valor); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao atualizar progresso"})
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
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao marcar meta como concluída"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mensagem": "Meta concluída com sucesso", "meta": meta})
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
