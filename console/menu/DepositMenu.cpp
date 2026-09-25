#include <iostream>
#include <vector>

#include "DepositMenu.h"

#include "../services/DepositService.h"
#include "../models/Deposit.h"

void depositMenu(
    std::vector<Deposit>& deposits
)
{
    int choice;

    do
    {
        std::cout << R"(

    ========================
           МОИ ВКЛАДЫ
    ========================

    1. Создать вклад
    2. Показать вклады
    3. Выбрать вклад
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
                createDeposit(deposits);
                break;

            case 2:
                displayDeposits(deposits);
                break;

            case 3:
                selectDeposit(deposits);
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
