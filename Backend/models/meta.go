package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Meta struct {
	ID          uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Nome        string    `json:"nome" gorm:"not null"`
	Descricao string `json:"descricao"`
	DataInicio  time.Time `json:"dataInicio"`
	DataLimite  time.Time `json:"dataLimite" `
	Valor       float32   `json:"valor"`
	ValorAlvo   float32   `json:"valor_alvo" gorm:"default:0"`
	Concluida   bool      `json:"concluida" gorm:"default:false"`

	ContaID   uint  `json:"conta_id"`
	Conta     Conta `json:"conta" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	ClienteID uint  `json:"cliente_id"`
}

//
//  MÉTODOS ENCAPSULADOS
//

// Associar conta à meta
func (m *Meta) AssociarConta(db *gorm.DB, contaID uint) error {
	m.ContaID = contaID
	return db.Model(m).Update("conta_id", contaID).Error
}

// Desassociar conta da meta
func (m *Meta) DesassociarConta(db *gorm.DB) error {
	m.ContaID = 0
	return db.Model(m).Update("conta_id", nil).Error
}

// Marcar como concluida
func (m *Meta) MarcarConcluida(db *gorm.DB) error {
	// Se já está concluída, retorna erro amigável
	if m.Concluida {
		return errors.New("a meta já está concluída")
	}

	// Validação: meta só pode ser concluída se tiver um valor alvo válido
	if m.ValorAlvo <= 0 {
		return errors.New("não é possível concluir uma meta sem valor alvo definido")
	}

	// Marca como concluída
	m.Concluida = true

	// Atualiza no banco
	if err := db.Model(m).Update("concluida", true).Error; err != nil {
		return err
	}

	return nil
}

// Atualizar nome da meta
func (m *Meta) AtualizarNome(db *gorm.DB, nome string) error {
	m.Nome = nome
	return db.Model(m).Update("nome", nome).Error
}

// Atualizar valor alvo da meta
func (m *Meta) AtualizarValorAlvo(db *gorm.DB, novoValor float32) error {
	if novoValor <= 0 {
		return errors.New("o valor alvo deve ser maior que zero")
	}

	// Regra complementar: não deixar valor atual ultrapassar valor alvo
	if m.Valor > novoValor {
		return errors.New("o valor alvo não pode ser menor que o valor já poupado")
	}

	m.ValorAlvo = novoValor

	return db.Model(m).Update("valor_alvo", novoValor).Error
}

// Atualizar data limite
func (m *Meta) AtualizarDataLimite(db *gorm.DB, data time.Time) error {
	m.DataLimite = data
	return db.Model(m).Update("dataLimite", data).Error
}

// Atualizar progresso e verificar conclusão automática
func (m *Meta) AtualizarProgresso(db *gorm.DB, valor float32) error {
	// Validação: não permitir valor negativo
	if valor < 0 {
		return errors.New("o valor do progresso não pode ser negativo")
	}

	// Validação: progresso não pode ultrapassar exageradamente o valor alvo
	if valor > m.ValorAlvo*1.2 {
		return errors.New("progresso muito acima do valor alvo — confirme o valor")
	}

	// Atualiza progresso
	m.Valor = valor
	if err := db.Model(m).Update("valor", valor).Error; err != nil {
		return err
	}

	// Regra automática: conclusão
	atingiuMeta := valor >= m.ValorAlvo

	// Só marca como concluída caso ainda não esteja
	if atingiuMeta && !m.Concluida {
		m.Concluida = true
		if err := db.Model(m).Update("concluida", true).Error; err != nil {
			return err
		}
	}

	return nil
}
