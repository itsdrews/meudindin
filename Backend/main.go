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
	r.PATCH("clientes/:cliente_id/contas/:conta_id", controllers.AtualizarConta)

	// Rotas Metas
	r.POST("/clientes/:cliente_id/contas/:conta_id/metas", controllers.CriarMeta)
	r.GET("/clientes/:cliente_id/contas/:conta_id/metas", controllers.ListarMetasPorConta)
	r.GET("/metas/:id", controllers.ObterMetaPorID)
	r.PATCH("/metas/:id/concluir", controllers.MarcarMetaConcluida)
	r.PATCH("/metas/:id/nome", controllers.AtualizarNomeMeta)
	r.PATCH("/metas/:id/valor_alvo", controllers.AtualizarValorAlvoMeta)
	r.PATCH("/metas/:id/data_limite", controllers.AtualizarDataLimiteMeta)
	r.PATCH("/metas/:id/progresso", controllers.AtualizarProgressoMeta)
	r.DELETE("/metas/:id", controllers.DeletarMeta)

	// Rotas Clientes
	r.POST("/clientes", controllers.CriarCliente)
	r.POST("/login", controllers.Login)
	r.DELETE("/clientes/:id", controllers.DeletarCliente)

	r.Run(":8080")
} // TODO: TESTAR METAS PELO JSON INSOMNIA.
