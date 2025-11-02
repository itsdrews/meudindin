package models

type Conta struct {
	ID        uint    `json:"id" gorm:"primaryKey;autoIncrement"`
	Numero    string  `json:"numero"`
	CodBanco  int     `json:"codBanco"`
	Agencia   int     `json:"agencia"`
	Tipo      string  `json:"tipo"`
	Banco     string  `json:"banco"`
	Saldo     float32 `json:"saldo"`
	ClienteID uint    `json:"cliente_id"`
	Apelido   string  `json:"apelido"`
}
