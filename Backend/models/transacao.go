package models

import "time"

type Transacao struct {
	ID            uint      `json:"id" gorm:"primaryKey;autoincrement"`
	Origem        string    `json:"origem"`
	Destino       string    `json:"destino"`
	Tipo          string    `json:"tipo"`
	Valor         float64   `json:"valor"`
	Data          time.Time `json:"data"`
	Descricao     string    `json:"descricao"`
	Identificador string    `json:"identificador"`
	ContaID       *uint     `json:"conta_id,omitempty" gorm:"default:null"`
}
