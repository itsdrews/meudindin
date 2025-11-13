package main

import (
	"Backend/controllers"
	"Backend/database"
	"Backend/middlewares"

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

	// Rotas públicas
	r.POST("/clientes", controllers.CriarCliente)
	r.POST("/login", controllers.Login)

	// Grupo protegido com JWT
	auth := r.Group("/")
	auth.Use(middlewares.JWTAuth())

	auth.POST("/contas", controllers.CriarConta)
	auth.GET("/contas", controllers.ListarContas)
	auth.DELETE("/contas/:id", controllers.RemoverConta)

	auth.POST("/metas", controllers.CriarMeta)
	auth.GET("/metas", controllers.ListarMetasPorConta)
	auth.PATCH("/metas/:id/concluir", controllers.MarcarMetaConcluida)
	auth.DELETE("/metas/:id", controllers.DeletarMeta)

	r.Run(":8080")
} // TODO: TESTAR METAS PELO JSON INSOMNIA.
