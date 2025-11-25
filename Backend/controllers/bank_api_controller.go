package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func ValidarContaFake(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"valido": true,
	})
}

func ValidarTransacaoFake(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"valido": true,
	})
}