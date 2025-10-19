package models

import "time"

type Meta struct {
	Description string    `json:"descricao"`
	DataLimite  time.Time `json:"dataLimite"`
	DataInicio  time.Time `json:"dataInicio"`
	Valor       float64   `json:"valor"`
}
