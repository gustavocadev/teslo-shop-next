# Next.js Teslo Shop App
para correr localmente, se necesita la base de datos en mongo
```
docker-compose up -d
```

* el -d, significa __detached__, es decir, no se sigue ejecutando el proceso

MongoDB URL local:
```mongodb://localhost:27017/teslodb```

## Configurar las variables de entorno
renombrar el archivo __.env.example__ a __.env__

## llenar la base de datos con información de prueba


llamar a:
https://localhost:3000/api/seed