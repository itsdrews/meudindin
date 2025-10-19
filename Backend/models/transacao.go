package models

import "time"

type Transacao struct {
	ID      uint      `json:"id" gorm:"primaryKey;autoincrement"`
	Origem  string    `json:"origem"`
	Destino string    `json:"destino"`
	Tipo    string    `json:"tipo"`
	Valor   float64   `json:"valor"`
	Data    time.Time `json:"data" gorm:"autoCreateTime"`
}
