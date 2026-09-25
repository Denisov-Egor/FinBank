#include <iostream>
#include <vector>

#include "OperationMenu.h"

#include "../services/OperationService.h"
#include "../models/Operation.h"

void operationMenu(
    const std::vector<Operation>& operations
)
{
    int choice;

    do
    {
        std::cout << R"(

    ========================
       ИСТОРИЯ ОПЕРАЦИЙ
    ========================

    1. Показать операции
    2. Выбрать операцию
    3. Вернуться

    ========================

    Выберите действие:

)";

        std::cin >> choice;

        if (std::cin.fail())
        {
            std::cin.clear();
            std::cin.ignore(10000, '\n');

            std::cout
                << "Ошибка: необходимо ввести число.\n";

            continue;
        }

        switch (choice)
        {
            case 1:

                displayOperations(
                    operations
                );

                break;

            case 2:

                selectOperation(
                    operations
                );

                break;

            case 3:

                std::cout
                    << "Возврат в главное меню.\n";

                break;

            default:

                std::cout
                    << "Неверный пункт меню.\n";
        }

    } while (choice != 3);
}
