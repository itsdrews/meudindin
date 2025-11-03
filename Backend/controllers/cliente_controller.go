package controllers

import (
	"net/http"
	"strconv"

	"errors"

	"Backend/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Assume que db *gorm.DB é injetado ou acessível
var DB *gorm.DB

// Inicialização (pode ser chamada no main)
func SetDB(db *gorm.DB) {
	DB = db
}

// Função auxiliar para gerar hash da senha
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// Função auxiliar para comparar senha
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// =====================
// Criar Cliente
// =====================
func CriarCliente(c *gin.Context) {
	var cliente models.Cliente

	if err := c.ShouldBindJSON(&cliente); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	// Verifica se CPF ou email já existem
	var existing models.Cliente
	if err := DB.Where("email = ? OR cpf = ?", cliente.Email, cliente.CPF).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"erro": "Email ou CPF já cadastrado"})
		return
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao verificar usuário"})
		return
	}

	// Criptografar senha
	hashedPassword, err := HashPassword(cliente.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao criptografar senha"})
		return
	}
	cliente.Password = hashedPassword

	// Salvar no banco
	if err := DB.Create(&cliente).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao salvar cliente"})
		return
	}

	// Não retornar senha
	cliente.Password = ""
	c.JSON(http.StatusCreated, cliente)
}

// =====================
// Login
// =====================
func Login(c *gin.Context) {
	var loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido"})
		return
	}

	var cliente models.Cliente
	result := DB.Where("email = ?", loginData.Email).First(&cliente)
	if result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"erro": "Usuário ou senha incorretos"})
		return
	}

	if !CheckPasswordHash(loginData.Password, cliente.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"erro": "Usuário ou senha incorretos"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login realizado com sucesso",
		"cliente": gin.H{
			"id":    cliente.ID,
			"nome":  cliente.Nome,
			"email": cliente.Email,
		},
	})
}

// =====================
// Deletar Cliente (cascade)
// =====================
func DeletarCliente(c *gin.Context) {

	idParam := c.Param("id")
	idUint, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "ID inválido"})
		return
	}
	id := uint(idUint)

	//  Buscar cliente pelo ID sem Preload
	var cliente models.Cliente
	if err := DB.First(&cliente, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"erro": "Cliente não encontrado"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao buscar cliente"})
		}
		return
	}

	// Deletar o cliente
	//    ON DELETE CASCADE vai automaticamente deletar contas e metas
	if err := DB.Delete(&cliente).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao deletar cliente"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cliente deletado com sucesso"})
}

// POST /clientes/:id/contas
func AddConta(c *gin.Context) {
	clienteID, _ := strconv.Atoi(c.Param("id"))
	var cliente models.Cliente
	if err := DB.First(&cliente, clienteID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cliente não encontrado"})
		return
	}

	var conta models.Conta
	if err := c.ShouldBindJSON(&conta); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := cliente.AdicionarConta(DB, &conta); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, conta)
}

// DELETE /clientes/:id/contas/:conta_id
func RemoveConta(c *gin.Context) {
	clienteID, _ := strconv.Atoi(c.Param("id"))
	contaID, _ := strconv.Atoi(c.Param("conta_id"))

	var cliente models.Cliente
	if err := DB.First(&cliente, clienteID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cliente não encontrado"})
		return
	}

	if err := cliente.RemoverConta(DB, uint(contaID)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

// GET /clientes/:id/contas
func ListContas(c *gin.Context) {
	clienteID, _ := strconv.Atoi(c.Param("id"))
	var cliente models.Cliente
	if err := DB.First(&cliente, clienteID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cliente não encontrado"})
		return
	}

	contas, err := cliente.ListarContas(DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, contas)
}

// POST /clientes/:id/metas
func AddMeta(c *gin.Context) {
	clienteID, _ := strconv.Atoi(c.Param("id"))
	var cliente models.Cliente
	if err := DB.First(&cliente, clienteID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cliente não encontrado"})
		return
	}

	var meta models.Meta
	if err := c.ShouldBindJSON(&meta); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := cliente.AdicionarMeta(DB, &meta); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, meta)
}

// DELETE /clientes/:id/metas/:meta_id
func RemoveMeta(c *gin.Context) {
	clienteID, _ := strconv.Atoi(c.Param("id"))
	metaID, _ := strconv.Atoi(c.Param("meta_id"))

	var cliente models.Cliente
	if err := DB.First(&cliente, clienteID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cliente não encontrado"})
		return
	}

	if err := cliente.RemoverMeta(DB, uint(metaID)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

// GET /clientes/:id/metas
func ListMetas(c *gin.Context) {
	clienteID, _ := strconv.Atoi(c.Param("id"))
	var cliente models.Cliente
	if err := DB.First(&cliente, clienteID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cliente não encontrado"})
		return
	}

	metas, err := cliente.ListarMetas(DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, metas)
}
