package models

import "time"

type Meta struct {
	ID          uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Nome        string    `json:"nome"`
	Description string    `json:"descricao"`
	DataLimite  time.Time `json:"dataLimite"`
	DataInicio  time.Time `json:"dataInicio"`
	Valor       float32   `json:"valor"`
	ValorAlvo   float32   `json:"valor_alvo"`
	ContaID     uint      `json:"conta_id"`
	Conta       Conta     `json:"conta" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"` // Derruba todas as metas se conta for removido
	Concluida   bool      `json:"concluida"`
	ClienteID   uint      `json:"cliente_id"`
}
