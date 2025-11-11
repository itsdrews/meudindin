package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Cliente struct {
	ID              uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Nome            string    `json:"nome"`
	CPF             string    `json:"cpf"`
	Email           string    `json:"email"`
	Password        string    `json:"password,omitempty"`                  // omitido ao retornar no JSON
	DataCadastro    time.Time `json:"data_cadastro" gorm:"autoCreateTime"` // TimeStamp da criação da entidade
	DataAtualizacao time.Time `json:"data_atualizacao" gorm:"autoUpdateTime"`
	Contas          []Conta   `json:"contas" gorm:"foreignKey:ClienteID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Metas           []Meta    `json:"metas" gorm:"foreignKey:ClienteID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
	
// Métodos da entidade Cliente
func (c *Cliente) AdicionarConta(db *gorm.DB, conta *Conta) error {
	conta.ClienteID = c.ID
	if err := db.Create(conta).Error; err != nil {
		return err
	}
	return nil
}

func (c *Cliente) RemoverConta(db *gorm.DB, contaID uint) error {
	// verifica se a conta pertence ao cliente
	var conta Conta
	if err := db.Where("id = ? AND cliente_id = ?", contaID, c.ID).First(&conta).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("conta não encontrada para este cliente")
		}
		return err
	}

	// remove a conta (ON DELETE CASCADE cuidara das metas relacionadas)
	if err := db.Delete(&conta).Error; err != nil {
		return err
	}
	return nil
}

func (c *Cliente) ListarContas(db *gorm.DB) ([]Conta, error) {
	var contas []Conta
	if err := db.Where("cliente_id = ?", c.ID).Find(&contas).Error; err != nil {
		return nil, err
	}
	return contas, nil
}

func (c *Cliente) AdicionarMeta(db *gorm.DB, meta *Meta) error {
	meta.ClienteID = c.ID
	if err := db.Create(meta).Error; err != nil {
		return err
	}
	return nil
}

func (c *Cliente) RemoverMeta(db *gorm.DB, metaID uint) error {
	var meta Meta
	if err := db.Where("id = ? AND cliente_id = ?", metaID, c.ID).First(&meta).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("meta não encontrada para este cliente")
		}
		return err
	}

	if err := db.Delete(&meta).Error; err != nil {
		return err
	}
	return nil
}

func (c *Cliente) ListarMetas(db *gorm.DB) ([]Meta, error) {
	var metas []Meta
	if err := db.Where("cliente_id = ?", c.ID).Find(&metas).Error; err != nil {
		return nil, err
	}
	return metas, nil
}
