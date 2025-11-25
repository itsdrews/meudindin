package main

import (
	"Backend/controllers"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.POST("/validar/conta", controllers.ValidarContaFake)
	r.POST("/validar/transacao", controllers.ValidarTransacaoFake)

	r.Run(":8081")
}
