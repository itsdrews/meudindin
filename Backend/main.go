package main

import (
	"Backend/controllers"
	"Backend/database"
	"Backend/models"

	"github.com/gin-gonic/gin"
)

func main() {
	// Conecta no PostgreSQL
	database.Conectar()

	db := database.DB

	// Auto-migrate (GORM cria as tabelas se não existirem)
	db.AutoMigrate(&models.Cliente{}, &models.Conta{}, &models.Meta{})

	// Configura DB nos controllers
	controllers.SetDB(db)

	r := gin.Default()

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
