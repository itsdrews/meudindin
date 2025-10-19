package main

import (
	"Backend/database"
	"Backend/routes"
)

func main() {
	database.Conectar()
	r := routes.SetupRoutes()
	r.Run(":8080")
}
