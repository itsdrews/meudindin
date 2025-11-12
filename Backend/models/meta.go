package models

import (
	"time"

	"gorm.io/gorm"
)

type Meta struct {
	ID          uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Nome        string    `json:"nome" gorm:"not null"`
	Description string    `json:"descricao"`
	DataInicio  time.Time `json:"dataInicio"`
	DataLimite  time.Time `json:"dataLimite"`
	Valor       float32   `json:"valor"`
	ValorAlvo   float32   `json:"valor_alvo"`
	Concluida   bool      `json:"concluida" gorm:"default:false"`

	ContaID   uint  `json:"conta_id"`
	Conta     Conta `json:"conta" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	ClienteID uint  `json:"cliente_id"`
}

//
// 🔒 MÉTODOS ENCAPSULADOS
//

// ✅ Associar conta à meta
func (m *Meta) AssociarConta(db *gorm.DB, contaID uint) error {
	m.ContaID = contaID
	return db.Model(m).Update("conta_id", contaID).Error
}

// ✅ Desassociar conta da meta
func (m *Meta) DesassociarConta(db *gorm.DB) error {
	m.ContaID = 0
	return db.Model(m).Update("conta_id", nil).Error
}

// ✅ Marcar meta como concluída
func (m *Meta) MarcarConcluida(db *gorm.DB) error {
	m.Concluida = true
	return db.Model(m).Update("concluida", true).Error
}

// ✅ Atualizar nome da meta
func (m *Meta) AtualizarNome(db *gorm.DB, nome string) error {
	m.Nome = nome
	return db.Model(m).Update("nome", nome).Error
}

// ✅ Atualizar valor alvo da meta
func (m *Meta) AtualizarValorAlvo(db *gorm.DB, valor float32) error {
	m.ValorAlvo = valor
	return db.Model(m).Update("valor_alvo", valor).Error
}

// ✅ Atualizar data limite
func (m *Meta) AtualizarDataLimite(db *gorm.DB, data time.Time) error {
	m.DataLimite = data
	return db.Model(m).Update("data_limite", data).Error
}

// ✅ Atualizar progresso e verificar conclusão automática
func (m *Meta) AtualizarProgresso(db *gorm.DB, valor float32) error {
	m.Valor = valor

	// Atualiza valor atual no banco
	if err := db.Model(m).Update("valor", valor).Error; err != nil {
		return err
	}

	// Regra automática: se atingir ou ultrapassar o valor alvo, marca como concluída
	if valor >= m.ValorAlvo && !m.Concluida {
		m.Concluida = true
		if err := db.Model(m).Update("concluida", true).Error; err != nil {
			return err
		}
	}

	return nil
}
