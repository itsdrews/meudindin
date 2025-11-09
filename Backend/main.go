package main

import (
	"Backend/controllers"
	"Backend/database"

	"github.com/gin-gonic/gin"
)

func main() {
	database.Conectar()
	controllers.SetDB(database.DB)

	r := gin.Default()
	// Configuração CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Rotas Contas
	r.POST("/clientes/:id/contas", controllers.AddConta)
	r.DELETE("/clientes/:id/contas/:conta_id", controllers.RemoveConta)
	r.GET("/clientes/:id/contas", controllers.ListContas)

	// Rotas Metas
	r.POST("/clientes/:id/metas", controllers.AddMeta)
	r.DELETE("/clientes/:id/metas/:meta_id", controllers.RemoveMeta)
	r.GET("/clientes/:id/metas", controllers.ListMetas)

	// Rotas Clientes
	r.POST("/clientes", controllers.CriarCliente)
	r.POST("/login", controllers.Login)
	r.DELETE("/clientes/:id", controllers.DeletarCliente)

	r.Run(":8080")
}
