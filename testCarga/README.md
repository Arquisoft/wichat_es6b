# 📊 Test de Carga  con Artillery

Este proyecto incluye un test de carga con [Artillery](https://artillery.io/) para simular usuarios interactuando con una API REST. El test incluye acciones típicas como: registrar usuarios, iniciar sesión, generar preguntas, guardar partidas y consultar estadísticas.

---


## Ver Resultado Test de carga 
Una version de los test de carga ya se puede ver en el siguiente link 
 - [Test de carga](https://app.artillery.io/share/sh_de116e83caeb52eb2db5e2c075a21c94dd7fe24eb40beaee2142e19d3b955c24)
## 🔧 Requisitos Previos

Antes de ejecutar el test, asegúrate de tener lo siguiente instalado:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Artillery CLI](https://artillery.io/docs/guides/getting-started/):
  
```bash
npm install -g artillery

Para poder ejecutar los test 

artillery run <Test.yml>
