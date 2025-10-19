package database

import (
	"fmt"
	"log"

	"Backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Conectar() {
	// ⚙️ Ajuste de acordo com o seu ambiente local
	host := "localhost"
	user := "postgres"
	password := "blackguns"
	dbName := "meudindin"
	port := "5432"
	sslmode := "disable"

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		host, user, password, dbName, port, sslmode)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Erro ao conectar ao PostgreSQL:", err)
	}

	fmt.Println("✅ Conectado ao PostgreSQL com sucesso!")

	DB.AutoMigrate(&models.Cliente{})
}
