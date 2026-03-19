const { exec } = require("child_process");

const migrationName = process.argv[2];

if (!migrationName) {
  console.error("⚠️  Informe o nome da migration");
  process.exit(1);
}

const fileName = `${migrationName}`;

const command = `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./database/migrations/${fileName} -d ./database/DataSource.ts`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(stdout);
});
