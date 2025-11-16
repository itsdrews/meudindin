package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Transacao struct {
	ID            uint      `json:"id" gorm:"primaryKey;autoincrement"`
	Origem        string    `json:"origem"`
	Destino       string    `json:"destino"`
	Tipo          string    `json:"tipo"`
	Valor         float64   `json:"valor"`
	Data          time.Time `json:"data"`
	Descricao     string    `json:"descricao"`
	Identificador string    `json:"identificador"`
	ContaID       uint      `json:"conta_id,omitempty" gorm:"not null"`
}

func (t *Transacao) AtualizarIdentificador(db *gorm.DB, novo string) error {
	if novo == "" {
		return errors.New("identificador não pode ser vazio")
	}
	t.Identificador = novo
	return db.Save(t).Error
}
func (t *Transacao) Categorizar(tipo int) error {
	if tipo == 0 {
		t.Tipo = "receita"
		return nil
	}
	if tipo == 1 {
		t.Tipo = "despesa"
		return nil
	}
	return errors.New("tipo inválido (use 0 para receita ou 1 para despesa)")
}
