package database

import (
    "fmt"
    "log"

    "Backend/models"

    "gorm.io/driver/sqlite"  // MUDAR para SQLite
    "gorm.io/gorm"
)

var DB *gorm.DB

func Conectar() {
    // Usando SQLite (arquivo local)
    dsn := "meudindin.db"  // Arquivo no mesmo diretório

    var err error
    DB, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Erro ao conectar ao SQLite:", err)
    }

    fmt.Println("Conectado ao SQLite com sucesso!")

    // Criar tabelas
    DB.AutoMigrate(&models.Cliente{}, &models.Conta{}, &models.Meta{}, &models.Transacao{})
}