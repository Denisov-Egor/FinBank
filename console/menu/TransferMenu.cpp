#include <iostream>
#include <vector>

#include "TransferMenu.h"

#include "../services/TransferService.h"
#include "../models/Transfer.h"

void transferMenu(
    std::vector<Transfer>& transfers
)
{
    int choice;

    do
    {
        std::cout << R"(

    ========================
          ПЕРЕВОДЫ
    ========================

    1. Создать перевод
    2. Показать переводы
    3. Выбрать перевод
    4. Вернуться

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
                createTransfer(transfers);
                break;

            case 2:
                displayTransfers(transfers);
                break;

            case 3:
                selectTransfer(transfers);
                break;

            case 4:
                std::cout
                    << "Возврат в главное меню.\n";
                break;

            default:
                std::cout
                    << "Неверный пункт меню.\n";
        }

    } while (choice != 4);
}
