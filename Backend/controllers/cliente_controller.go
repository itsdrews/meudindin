package controllers

import (
	"Backend/database"
	"Backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// Função auxiliar para gerar hash da senha
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CriarCliente(c *gin.Context) {
	var cliente models.Cliente

	if err := c.ShouldBindJSON(&cliente); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	//  Criptografar senha
	hashedPassword, err := HashPassword(cliente.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao criptografar senha"})
		return
	}
	cliente.Password = hashedPassword

	// 💾 Salvar no banco
	if err := database.DB.Create(&cliente).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao salvar cliente"})
		return
	}

	// Não retornar senha ao cliente
	cliente.Password = ""
	c.JSON(http.StatusCreated, cliente)
}

// Func para logar
func Login(c *gin.Context) {
	var loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido"})
		return
	}

	var cliente models.Cliente
	result := database.DB.Where("email = ?", loginData.Email).First(&cliente)
	if result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email não encontrado"})
		return
	}

	// Compara a senha enviada com a senha criptografada do banco
	err := bcrypt.CompareHashAndPassword([]byte(cliente.Password), []byte(loginData.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Senha incorreta"})
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
