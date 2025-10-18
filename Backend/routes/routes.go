package routes

import (
	"Backend/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Exemplo de rota
	r.GET("/", controllers.Home)

	// Rota de exemplo para usuário
	r.GET("/users", controllers.GetUsers)

	return r
}
