package models

import (
	"errors"

	"gorm.io/gorm"
)

type Conta struct {
	ID        uint    `json:"id" gorm:"primaryKey;autoIncrement"`
	Numero    string  `json:"numero" gorm:"not null;uniqueIndex:idx_conta_agencia"`
	Agencia   int     `json:"agencia" gorm:"not null;uniqueIndex:idx_conta_agencia"`
	CodBanco  int     `json:"codBanco" gorm:"not null"`
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
		"apelido":  true,
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

// AtualizaSaldo recalcula o saldo da conta com base nas transações existentes
func (c *Conta) AtualizaSaldo(db *gorm.DB) error {
	var receitas float32
	var despesas float32

	// RECEITAS
	if err := db.Table("transacaos").
		Where("conta_id = ? AND (tipo = 'receita' OR tipo = 'receitas' OR tipo='entrada')", c.ID).
		Select("COALESCE(SUM(valor), 0)").
		Scan(&receitas).Error; err != nil {
		return err
	}

	// DESPESAS
	if err := db.Table("transacaos").
		Where("conta_id = ? AND (tipo = 'despesa' OR tipo = 'despesas' OR tipo = 'saída')", c.ID).
		Select("COALESCE(SUM(valor), 0)").
		Scan(&despesas).Error; err != nil {
		return err
	}

	// Novo saldo
	novoSaldo := receitas - despesas

	// Atualiza a conta no banco
	if err := db.Model(c).Update("saldo", novoSaldo).Error; err != nil {
		return err
	}

	// Atualiza o campo local da struct também
	c.Saldo = novoSaldo

	return nil
}
