package controllers

import (
	"Backend/models"
	"Backend/services"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Criar Conta
// POST /contas
func CriarConta(c *gin.Context) {
	// Obtém ID do cliente via URL
	clienteIDValue, existe := c.Get("cliente_id")
	if !existe {
		c.JSON(http.StatusUnauthorized, gin.H{"erro": "Token inválido ou ausente"})
		return
	}
	clienteID := clienteIDValue.(uint)
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

	if err := services.ValidarContaExternamente(novaConta); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"erro":     "Conta inválida",
			"detalhes": err.Error(),
		})
		return
	}

	// Usa o método encapsulado do Cliente
	if err := cliente.AdicionarConta(DB, &novaConta); err != nil {
		if strings.Contains(err.Error(), "duplicate key value") ||
			strings.Contains(err.Error(), "UNIQUE constraint failed") {
			c.JSON(http.StatusConflict, gin.H{"erro": "Já existe uma conta com o mesmo número, agência e banco"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao criar conta", "detalhes": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"mensagem": "Conta criada com sucesso!",
		"conta":    novaConta,
	})
}

// Listar Contas
// GET /contas
func ListarContas(c *gin.Context) {
	clienteIDValue, existe := c.Get("cliente_id")
	if !existe {
		c.JSON(http.StatusUnauthorized, gin.H{"erro": "Token inválido ou ausente"})
		return
	}
	clienteID := clienteIDValue.(uint)
	// Verifica cliente
	var cliente models.Cliente
	if err := DB.First(&cliente, clienteID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Cliente não encontrado"})
		return
	}

	// Usa o método encapsulado
	contas, err := cliente.ListarContas(DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao buscar contas"})
		return
	}

	c.JSON(http.StatusOK, contas)
}

// GET /contas/:id
func BuscarContaPorID(c *gin.Context) {
	// Pega ID do cliente vindo do token
	clienteIDValue, existe := c.Get("cliente_id")
	if !existe {
		c.JSON(http.StatusUnauthorized, gin.H{"erro": "Token inválido ou ausente"})
		return
	}
	clienteID := clienteIDValue.(uint)

	// ID da conta passado no parâmetro da rota
	contaID := c.Param("id")

	var conta models.Conta

	// Busca a conta
	if err := DB.First(&conta, contaID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Conta não encontrada"})
		return
	}

	// Segurança: verifica se a conta pertence ao cliente logado
	if conta.ClienteID != clienteID {
		c.JSON(http.StatusForbidden, gin.H{"erro": "Você não tem permissão para acessar esta conta"})
		return
	}

	c.JSON(http.StatusOK, conta)
}

// Remover Conta
// DELETE contas/:conta_id
func RemoverConta(c *gin.Context) {
	//  Obtém o ID do cliente a partir do token JWT (middleware)
	clienteIDValue, existe := c.Get("cliente_id")
	if !existe {
		c.JSON(http.StatusUnauthorized, gin.H{"erro": "Token inválido ou ausente"})
		return
	}

	// Faz a conversão segura do valor do token
	clienteID, ok := clienteIDValue.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Falha ao interpretar ID do cliente"})
		return
	}

	//  Obtém o ID da conta via parâmetro da rota
	contaIDParam := c.Param("id")
	contaID64, err := strconv.ParseUint(contaIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "ID de conta inválido"})
		return
	}
	contaID := uint(contaID64)

	// Busca o cliente autenticado
	var cliente models.Cliente
	if err := DB.First(&cliente, clienteID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Cliente não encontrado"})
		return
	}

	//  Usa o método encapsulado no modelo para remover a conta
	if err := cliente.RemoverConta(DB, contaID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) || strings.Contains(err.Error(), "não encontrada") {
			c.JSON(http.StatusNotFound, gin.H{"erro": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao remover conta"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"mensagem": "Conta removida com sucesso"})
}

// PATCH /contas/:conta_id
func AtualizarConta(c *gin.Context) {
	//  Obtém o ID do cliente autenticado (do token JWT)
	clienteIDValue, existe := c.Get("cliente_id")
	if !existe {
		c.JSON(http.StatusUnauthorized, gin.H{"erro": "Token inválido ou ausente"})
		return
	}

	// Converte o tipo interface{} → uint
	clienteID, ok := clienteIDValue.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Falha ao interpretar ID do cliente"})
		return
	}

	//  Obtém o ID da conta via rota
	contaIDParam := c.Param("id")
	contaID64, err := strconv.ParseUint(contaIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "ID de conta inválido"})
		return
	}
	contaID := uint(contaID64)

	//  Busca o cliente no banco
	var cliente models.Cliente
	if err := DB.First(&cliente, clienteID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Cliente não encontrado"})
		return
	}

	//  Busca a conta pertencente a esse cliente
	var conta models.Conta
	if err := DB.Where("id = ? AND cliente_id = ?", contaID, cliente.ID).First(&conta).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"erro": "Conta não encontrada para este cliente"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao buscar conta"})
		return
	}

	//  Faz o bind dos campos atualizáveis
	var novosCampos map[string]interface{}
	if err := c.ShouldBindJSON(&novosCampos); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido"})
		return
	}

	//  Atualiza os campos no modelo
	if err := conta.AtualizarCamposEditaveis(DB, novosCampos); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao atualizar conta", "detalhes": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"mensagem": "Conta atualizada com sucesso",
		"conta":    conta,
	})
}

// PATCH /contas/atualizar-saldos
func AtualizarSaldoTodasContas(c *gin.Context) {
	// ID do cliente autenticado
	clienteIDValue, existe := c.Get("cliente_id")
	if !existe {
		c.JSON(http.StatusUnauthorized, gin.H{"erro": "Token inválido ou ausente"})
		return
	}
	clienteID := clienteIDValue.(uint)

	// Buscar todas as contas do cliente
	var contas []models.Conta
	if err := DB.Where("cliente_id = ?", clienteID).Find(&contas).Error; err != nil {
		fmt.Println("ERRO: Falha ao buscar contas ->", err)
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao buscar contas"})
		return
	}

	if len(contas) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Nenhuma conta encontrada para este cliente"})
		return
	}

	// Atualiza saldo uma por uma
	for i := range contas {

		fmt.Println("---- ATUALIZANDO SALDO DA CONTA ----")
		fmt.Println("Conta ID:", contas[i].ID)

		if err := contas[i].AtualizaSaldo(DB); err != nil {

			// SENTINELA DE DEBUG
			fmt.Println("⚠️ ERRO AO CALCULAR SALDO")
			fmt.Println("Conta:", contas[i].ID)
			fmt.Println("Erro:", err)

			// DEBUG avançado: query usada
			stmt := DB.Statement
			fmt.Println("SQL gerado:", stmt.SQL.String())
			fmt.Println("Vars:", stmt.Vars)

			c.JSON(http.StatusInternalServerError, gin.H{
				"erro":    "Erro ao atualizar saldo de uma conta",
				"conta":   contas[i].ID,
				"detalhe": err.Error(),
			})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"mensagem":   "Saldos de todas as contas foram atualizados com sucesso!",
		"quantidade": len(contas),
	})
}
