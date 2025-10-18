package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Home(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Bem-vindo ao backend MeuDindin!",
	})
}

func GetUsers(c *gin.Context) {
	users := []string{"Alice", "Bruno", "Carlos"}
	c.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}
