package models

type Cliente struct {
	ID       uint   `json:"id" gorm:"primaryKey;autoIncrement"`
	Nome     string `json:"nome"`
	CPF      string `json:"cpf"`
	Email    string `json:"email"`
	Password string `json:"password,omitempty"` // omitido ao retornar no JSON
}
