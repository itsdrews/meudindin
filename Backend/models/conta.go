package models

import (
	"errors"

	"gorm.io/gorm"
)

type Conta struct {
	ID        uint    `json:"id" gorm:"primaryKey;autoIncrement"`
	Numero    string  `json:"numero" gorm:"not null"`
	CodBanco  int     `json:"codBanco" gorm:"not null"`
	Agencia   int     `json:"agencia" gorm:"not null"`
	Tipo      string  `json:"tipo" gorm:"not null"`
	Banco     string  `json:"banco" gorm:"not null"`
	Saldo     float32 `json:"saldo" gorm:"not null"`
	ClienteID uint    `json:"cliente_id"`
	Apelido   string  `json:"apelido"`
}

// Associa a conta a um cliente
func (c *Conta) AssociarCliente(db *gorm.DB, clienteID uint) error {
	if c == nil {
		return errors.New("conta inválida")
	}

	c.ClienteID = clienteID
	return db.Save(c).Error
}

// Remove associação com cliente

func (c *Conta) DesassociarCliente(db *gorm.DB) error {
	if c == nil {
		return errors.New("conta inválida")
	}

	c.ClienteID = 0 // ou nil se usar ponteiro *uint
	return db.Save(c).Error
}

// Atualiza apenas campos editáveis

func (c *Conta) AtualizarCamposEditaveis(db *gorm.DB, novosDados map[string]interface{}) error {
	if c == nil {
		return errors.New("conta inválida")
	}

	// Permitir atualizar apenas campos selecionados
	camposPermitidos := map[string]bool{
		"Numero":   false,
		"CodBanco": false,
		"Agencia":  false,
		"Tipo":     false,
		"Banco":    false,
		"Saldo":    false,
		"Apelido":  true,
	}

	// Filtra apenas campos permitidos
	dadosFiltrados := make(map[string]interface{})
	for chave, valor := range novosDados {
		if camposPermitidos[chave] {
			dadosFiltrados[chave] = valor
		}
	}

	if len(dadosFiltrados) == 0 {
		return errors.New("nenhum campo editável fornecido")
	}

	// Atualiza os campos no banco
	return db.Model(c).Updates(dadosFiltrados).Error
}
