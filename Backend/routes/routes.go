package routes

import (
	"Backend/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()
	r.POST("/clientes", controllers.CriarCliente)
	r.POST("/login", controllers.Login)
	return r
}
