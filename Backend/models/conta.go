package models

type Conta struct {
	ID      uint      `json:"id" gorm:"primaryKey;autoincrement"`
	Numero   string `json:"numero"`
	CodBanco int    `json:"codBanco"`
	Agencia  int    `json:"agencia"`
}
