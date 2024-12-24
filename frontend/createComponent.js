const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Создаем интерфейс для ввода с командной строки
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const createReactComponent = (componentName) => {
  // Путь к папке компонента в уже существующей структуре src/Components
  const componentFolder = path.join(
    __dirname,
    "src",
    "Components",
    componentName
  );

  // Проверка, существует ли папка компонента, если нет - создаем
  if (!fs.existsSync(componentFolder)) {
    fs.mkdirSync(componentFolder, { recursive: true });
    console.log(`Папка для компонента ${componentName} была успешно создана.`);
  } else {
    console.log(`Папка для компонента ${componentName} уже существует.`);
  }

  // Путь к файлу компонента
  const componentFile = path.join(componentFolder, `${componentName}.jsx`);

  // Путь к файлу SCSS
  const scssFile = path.join(componentFolder, `${componentName}.scss`);

  // Структура компонента (JSX)
  const componentContent = `
import React from 'react';
import './${componentName}.scss';

const ${componentName} = () => {
  return (
    <div className="${componentName.toLowerCase()}">
        <div className="${componentName.toLowerCase()}-">
            <div className="${componentName.toLowerCase()}-"></div>
            <div className="${componentName.toLowerCase()}-"></div>
            <div className="${componentName.toLowerCase()}-"></div>
        </div>
    </div>
  );
};

export default ${componentName};
  `;

  // Структура SCSS
  const scssContent = `
.${componentName.toLowerCase()} {
  
  &- {
   

    &- {
     
    }

    &- {
     
    }

    &- {
     
    }
  }
}
  `;

  // Запись содержимого в файл компонента (JSX)
  fs.writeFileSync(componentFile, componentContent, "utf8");
  console.log(
    `Компонент ${componentName} был успешно создан в ${componentFile}`
  );

  // Запись содержимого в файл SCSS
  fs.writeFileSync(scssFile, scssContent, "utf8");
  console.log(
    `Файл стилей ${componentName}.scss был успешно создан в ${scssFile}`
  );
};

// Запрашиваем имя компонента у пользователя
rl.question("Введите название нового компонента: ", (componentName) => {
  if (!componentName) {
    console.log("Имя компонента не может быть пустым.");
    rl.close();
    process.exit(1); // Завершаем процесс с ошибкой
  }

  // Создаем компонент с заданным именем
  createReactComponent(componentName);

  // Закрываем интерфейс readline и завершаем процесс
  rl.close();
  process.exit(0); // Завершаем процесс успешно
});
