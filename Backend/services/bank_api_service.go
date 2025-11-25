package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func ValidarContaExternamente(payload interface{}) error {
	url := "http://localhost:8081/validar/conta"

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("erro ao gerar JSON: %v", err)
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return fmt.Errorf("não foi possível conectar à API externa de validação: %v", err)
	}
	defer resp.Body.Close()

	// se deu 200, consideramos válido
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("API externa retornou status: %d", resp.StatusCode)
	}

	return nil
}

func ValidarTransacaoExternamente(payload interface{}) error {
	url := "http://localhost:8081/validar/transacao"

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("erro ao serializar JSON da transação: %v", err)
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return fmt.Errorf("não foi possível conectar à API externa de validação: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		responseBody, _ := ioutil.ReadAll(resp.Body)
		return fmt.Errorf("API de validação retornou erro (%d): %s",
			resp.StatusCode, string(responseBody))
	}

	return nil
}
