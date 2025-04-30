# 📊 Test de Carga  con Artillery

Este proyecto incluye un test de carga con [Artillery](https://artillery.io/) para simular usuarios interactuando con una API REST. El test incluye acciones típicas como: registrar usuarios, iniciar sesión, generar preguntas, guardar partidas y consultar estadísticas.

---


## Ver Resultado Test de carga 
Una version de los test de carga ya se puede ver en el siguiente link 
 - [Test de carga](https://app.artillery.io/share/sh_edc67efc3338ffd5ce3597f2630437a28429b2e2658deca47bee992c195cff7b)
## 🔧 Requisitos Previos

Antes de ejecutar el test, asegúrate de tener lo siguiente instalado:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Artillery CLI](https://artillery.io/docs/guides/getting-started/):
  
```bash
npm install -g artillery

Para poder ejecutar los test 

artillery run <Test.yml>
