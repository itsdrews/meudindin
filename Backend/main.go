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
	auth.PATCH("/contas/:id", controllers.AtualizarConta)
	auth.GET("/contas/:id", controllers.BuscarContaPorID)	

	// Transações
	auth.GET("/contas/:id/transacoes", controllers.ListarTransacoesPorConta)
	auth.GET("/contas/:id/transacoes/:transacaoId", controllers.ObterTransacaoPorID)
	auth.POST("/contas/:id/transacoes", controllers.CriarTransacao)
	auth.PATCH("/contas/:id/transacoes/:transacaoId", controllers.AtualizarIdentificadorTransacao)

	// Rotas Metas
	auth.POST("/contas/:id/metas", controllers.CriarMeta)              // Cria meta para conta específica
	auth.GET("/metas", controllers.ListarMetasPorCliente)              // Lista metas da conta
	auth.PATCH("/metas/:id/concluir", controllers.MarcarMetaConcluida) // Marca meta como concluída
	auth.DELETE("/metas/:id", controllers.DeletarMeta)                 // Deleta meta
	auth.GET("/metas/:id", controllers.ObterMetaPorID)                 // Acessar Meta por ID
	metas := r.Group("/metas")
	{
		metas.PATCH("/:id/nome", controllers.AtualizarNomeMeta)
		metas.PATCH("/:id/valor-alvo", controllers.AtualizarValorAlvoMeta)
		metas.PATCH("/:id/data-limite", controllers.AtualizarDataLimiteMeta)
		metas.PATCH("/:id/progresso", controllers.AtualizarProgressoMeta)
	}

	r.Run(":8080")
}
