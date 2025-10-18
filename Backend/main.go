package main

import (
	"Backend/routes"
)

func main() {
	r := routes.SetupRouter()
	r.Run(":8080")
}
