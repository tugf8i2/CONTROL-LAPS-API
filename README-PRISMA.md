# Configuración de PostgreSQL y Prisma

1. Instala PostgreSQL y crea una base de datos llamada controllabs.
2. Copia .env.example como .env y ajusta DATABASE_URL.
3. Ejecuta npm install.
4. Ejecuta npx prisma generate.
5. Ejecuta npx prisma db push para aplicar el esquema de práctica.
6. Ejecuta npm run dev.

La API utiliza persistencia PostgreSQL para usuarios, ambientes, equipos y préstamos.
Los registros no se borran de memoria al reiniciar, ya que se guardan en PostgreSQL.
