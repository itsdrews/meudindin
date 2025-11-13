package utils

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte(getSecret())

func getSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		// valor padrão (apenas para desenvolvimento)
		secret = "segredo-super-seguro"
	}
	return secret
}

type Claims struct {
	ClienteID uint `json:"cliente_id"`
	jwt.RegisteredClaims
}

// GerarToken gera um JWT válido por 24 horas
func GerarToken(clienteID uint) (string, error) {
	claims := &Claims{
		ClienteID: clienteID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// ValidarToken valida o token JWT e retorna os claims
func ValidarToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("token inválido")
	}

	return claims, nil
}
