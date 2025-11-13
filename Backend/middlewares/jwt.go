package middlewares

import (
	"net/http"
	"strings"

	"Backend/utils"
	"github.com/gin-gonic/gin"
)

func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"erro": "Token ausente"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := utils.ValidarToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"erro": "Token inválido ou expirado"})
			c.Abort()
			return
		}

		// injeta o cliente_id no contexto
		c.Set("cliente_id", claims.ClienteID)
		c.Next()
	}
}
